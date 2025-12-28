import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('axios', () => {
  // create a single shared instance so both the module under test and the test file
  // can observe the same spies
  const get = vi.fn()
  const post = vi.fn()
  const instance = { get, post }
  return { create: () => instance, default: { create: () => instance }, __esModule: true }
})

import axios from 'axios'
import { searchInteractions, uploadFile } from './api'
import type { SearchFilters } from '../types'

describe('api service', () => {
  let instance: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    instance = axios.create() as { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> }
    instance.get.mockReset()
    instance.post.mockReset()
    // Provide lightweight File/FormData polyfills for the Node test environment
    global.File = global.File || class {
      parts: unknown
      name: string
      type?: string
      size: number
      constructor(parts: unknown, name: string, options?: { type?: string }) { 
        this.parts = parts
        this.name = name
        this.type = options?.type
        this.size = 0
      }
    } as unknown as typeof File
    global.FormData = global.FormData || class {
      _map: Map<string, unknown>
      constructor() { this._map = new Map() }
      append(k: string, v: unknown) { this._map.set(k, v) }
      get(k: string) { return this._map.get(k) }
    } as unknown as typeof FormData
  })

  it('builds the correct search query and calls get', async () => {
    instance.get.mockResolvedValue({ data: { totalElements: 0, interactions: [], totalPages: 0, currentPage: 0, pageSize: 10 } })

    const filters: SearchFilters = {
      customerId: 'CUST-001',
      interactionType: 'email',
      startDate: '2025-12-11T00:00:00',
      endDate: '2025-12-12T00:00:00',
      page: 1,
      size: 5,
    }

    await searchInteractions(filters)

    // ensure get was called once
    expect(instance.get).toHaveBeenCalledTimes(1)
    const calledWith = instance.get.mock.calls[0][0] as string
    expect(calledWith).toContain('/interactions/search')
    expect(calledWith).toContain('customerId=CUST-001')
    expect(calledWith).toContain('interactionType=email')
    expect(calledWith).toContain('page=1')
    expect(calledWith).toContain('size=5')
  })

  it('uploads a file using post', async () => {
    const fakeFile = new File(['a,b,c'], 'test.csv', { type: 'text/csv' })
    instance.post.mockResolvedValue({ data: { success: true, message: 'Upload successful' } })

    await uploadFile(fakeFile)

    expect(instance.post).toHaveBeenCalledTimes(1)
    const [url, formData] = instance.post.mock.calls[0] as [string, FormData]
    expect(url).toBe('/uploads')
    // formData is a FormData instance — ensure it has our file
    expect(formData.get('file')).toBeTruthy()
  })
})

