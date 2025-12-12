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

describe('api service', () => {
  let instance

  beforeEach(() => {
    instance = axios.create()
    instance.get.mockReset()
    instance.post.mockReset()
    // Provide lightweight File/FormData polyfills for the Node test environment
    global.File = global.File || class {
      constructor(parts, name, options) { this.parts = parts; this.name = name; this.type = options?.type }
    }
    global.FormData = global.FormData || class {
      constructor() { this._map = new Map() }
      append(k, v) { this._map.set(k, v) }
      get(k) { return this._map.get(k) }
    }
  })

  it('builds the correct search query and calls get', async () => {
    instance.get.mockResolvedValue({ data: { totalElements: 0 } })

    const filters = {
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
    const calledWith = instance.get.mock.calls[0][0]
    expect(calledWith).toContain('/interactions/search')
    expect(calledWith).toContain('customerId=CUST-001')
    expect(calledWith).toContain('interactionType=email')
    expect(calledWith).toContain('page=1')
    expect(calledWith).toContain('size=5')
  })

  it('uploads a file using post', async () => {
    const fakeFile = new File(['a,b,c'], 'test.csv', { type: 'text/csv' })
    instance.post.mockResolvedValue({ data: { success: true } })

    await uploadFile(fakeFile)

    expect(instance.post).toHaveBeenCalledTimes(1)
    const [url, formData] = instance.post.mock.calls[0]
    expect(url).toBe('/uploads')
    // formData is a FormData instance — ensure it has our file
    expect(formData.get('file')).toBeTruthy()
  })
})
