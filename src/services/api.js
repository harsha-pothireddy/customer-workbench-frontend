import axios from 'axios'

// Use Vite environment variable if provided, otherwise fall back to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const uploadFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)

  return api.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const searchInteractions = (filters) => {
  const params = new URLSearchParams()

  if (filters.customerId) params.append('customerId', filters.customerId)
  if (filters.interactionType) params.append('interactionType', filters.interactionType)
  if (filters.startDate) params.append('startDate', filters.startDate)
  if (filters.endDate) params.append('endDate', filters.endDate)
  params.append('page', filters.page || 0)
  params.append('size', filters.size || 10)

  return api.get(`/interactions/search?${params.toString()}`)
}

export default api
