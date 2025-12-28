/**
 * Type definitions for the application
 */

export interface SearchFilters {
  customerId: string
  interactionType: string
  startDate: string
  endDate: string
  page: number
  size: number
}

export interface Interaction {
  customerId: string
  interactionType: string
  timestamp: string
  feedback?: string
  responsesFromCustomerSupport?: string
  productId?: string
  customerRating?: number
}

export interface SearchResponse {
  interactions: Interaction[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export interface UploadResponse {
  success: boolean
  message: string
  uploadJobId?: number
  processedRecords?: number
  failedRecords?: number
}

