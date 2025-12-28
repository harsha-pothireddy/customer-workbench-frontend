/**
 * Utility functions for formatting data
 */

/**
 * Truncates text to a specified maximum length
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation (default: 50)
 * @returns Truncated text with ellipsis or '-' if text is empty
 */
export const truncateText = (text: string | null | undefined, maxLength = 50): string => {
  if (!text) return '-'
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

/**
 * Formats a date string to a locale-aware date and time string
 * @param dateString - ISO date string
 * @returns Formatted date and time string or '-' if date is empty
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

