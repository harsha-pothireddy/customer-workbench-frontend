/**
 * File upload constants
 */

// Maximum file size: 10MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

// Allowed file MIME types
export const ALLOWED_FILE_TYPES: string[] = [
  'text/csv',
  'application/json',
  'application/vnd.ms-excel'
]

// Allowed file extensions
export const ALLOWED_FILE_EXTENSIONS: string[] = ['.csv', '.json']

