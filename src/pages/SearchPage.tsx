import { useState, useCallback, useEffect, ChangeEvent, FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchInteractions } from '../services/api'
import { formatDate, truncateText } from '../utils/formatUtils'
import type { SearchFilters, SearchResponse } from '../types'
import './SearchPage.css'
import { DataTable, DataTablePageEvent, DataTableFilterEvent } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'

const INTERACTION_TYPE_OPTIONS = [
  { label: '', value: '' },
  { label: 'email', value: 'email' },
  { label: 'chat', value: 'chat' },
  { label: 'ticket', value: 'ticket' },
  { label: 'feedback', value: 'feedback' },
]

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize filters from URL params
  const getFiltersFromURL = useCallback((): SearchFilters => {
    return {
      customerId: searchParams.get('customerId') || '',
      interactionType: searchParams.get('interactionType') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      page: parseInt(searchParams.get('page') || '0', 10),
      size: parseInt(searchParams.get('size') || '5', 10),
    }
  }, [searchParams])

  const [filters, setFilters] = useState<SearchFilters>(getFiltersFromURL)
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [hasSearched, setHasSearched] = useState<boolean>(false)

  // Fetch results function
  const fetchResults = useCallback(async (currentFilters: SearchFilters) => {
    setLoading(true)
    setError('')
    setHasSearched(true)

    try {
      const response = await searchInteractions(currentFilters)
      setResults(response.data)
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string }
      setError(axiosError.response?.data?.message || axiosError.message || 'Search failed')
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Sync URL params when filters change
  const updateURLParams = useCallback((newFilters: SearchFilters) => {
    const params = new URLSearchParams()
    if (newFilters.customerId) params.set('customerId', newFilters.customerId)
    if (newFilters.interactionType) params.set('interactionType', newFilters.interactionType)
    if (newFilters.startDate) params.set('startDate', newFilters.startDate)
    if (newFilters.endDate) params.set('endDate', newFilters.endDate)
    if (newFilters.page > 0) params.set('page', newFilters.page.toString())
    if (newFilters.size !== 5) params.set('size', newFilters.size.toString())
    setSearchParams(params, { replace: true })
  }, [setSearchParams])

  // Initialize filters from URL on mount - only run once
  useEffect(() => {
    const urlFilters = getFiltersFromURL()
    setFilters(urlFilters)
    // If URL has params, automatically trigger search
    const hasParams = urlFilters.customerId || urlFilters.interactionType || urlFilters.startDate || urlFilters.endDate
    if (hasParams) {
      fetchResults(urlFilters)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Update filters and search when URL changes externally (e.g., browser back/forward)
  useEffect(() => {
    const urlFilters = getFiltersFromURL()
    setFilters(urlFilters)
    const hasParams = urlFilters.customerId || urlFilters.interactionType || urlFilters.startDate || urlFilters.endDate
    if (hasParams && hasSearched) {
      fetchResults(urlFilters)
    }
  }, [searchParams, getFiltersFromURL, fetchResults, hasSearched])

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const newFilters: SearchFilters = {
      ...filters,
      [name]: value,
      page: 0, // Reset to first page on filter change
    }
    setFilters(newFilters)
    updateURLParams(newFilters)
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateURLParams(filters)
    fetchResults(filters)
  }

  const handlePageChange = (event: DataTablePageEvent) => {
    const newFilters: SearchFilters = {
      ...filters,
      page: event.page || 0,
      size: event.rows || 5,
    }
    setFilters(newFilters)
    updateURLParams(newFilters)
    fetchResults(newFilters)
  }

  const handleFilterChangeFromTable = (event: DataTableFilterEvent) => {
    // event.filters: { field: { value, matchMode } }
    const tableFilters = event.filters || {}
    const newFilters: SearchFilters = { ...filters }

    if (tableFilters.customerId && typeof tableFilters.customerId.value === 'string') {
      newFilters.customerId = tableFilters.customerId.value
    }

    if (tableFilters.interactionType && typeof tableFilters.interactionType.value === 'string') {
      newFilters.interactionType = tableFilters.interactionType.value
    }

    // For other columns like feedback we can map to a free-text search param if backend supports it

    newFilters.page = 0
    setFilters(newFilters)
    updateURLParams(newFilters)
    fetchResults(newFilters)
  }

  return (
    <div className="container">
      <h1>Search Customer Interactions</h1>
      <p className="subtitle">Search and filter customer interaction records</p>

      <form onSubmit={handleSearch} className="search-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customerId">Customer ID</label>
            <input
              id="customerId"
              name="customerId"
              type="text"
              placeholder="Enter customer ID"
              value={filters.customerId}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="interactionType">Interaction Type</label>
            <select
              id="interactionType"
              name="interactionType"
              value={filters.interactionType}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="email">Email</option>
              <option value="chat">Chat</option>
              <option value="ticket">Support Ticket</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="datetime-local"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              name="endDate"
              type="datetime-local"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-search">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="alert alert-error">
          ✗ {error}
        </div>
      )}

      {hasSearched && !loading && results && (
        <div className="results-section">
          <div className="results-header">
            <h2>Results ({results.totalElements} total)</h2>
            <p className="results-info">
              Page {results.currentPage + 1} of {results.totalPages} | 
              Showing {results.interactions.length} of {results.totalElements} records
            </p>
          </div>

          {results.interactions.length === 0 ? (
            <div className="alert alert-info">
              ℹ No results found matching your criteria
            </div>
          ) : (
            <div className="table-wrapper">
              <DataTable
                value={results.interactions}
                lazy
                paginator
                first={results.currentPage * filters.size}
                rows={filters.size}
                totalRecords={results.totalElements}
                onPage={handlePageChange}
                onFilter={handleFilterChangeFromTable}
                rowsPerPageOptions={[5,10,25,50]}
                emptyMessage="No results found"
              >
                <Column field="timestamp" header="Timestamp" body={(row) => formatDate(row.timestamp)} sortable/>
                <Column field="customerId" header="Customer ID" filter filterField="customerId"/>
                <Column 
                  field="interactionType" 
                  header="Interaction Type" 
                  filter 
                  filterField="interactionType" 
                  filterElement={(options) => (
                    <Dropdown 
                      value={options.value} 
                      options={INTERACTION_TYPE_OPTIONS} 
                      onChange={(e) => options.filterCallback(e.value)} 
                      placeholder="Select"
                    />
                  )} 
                />
                <Column field="feedback" header="Feedback" body={(row) => truncateText(row.feedback, 40)} filter filterField="feedback"/>
                <Column field="responsesFromCustomerSupport" header="Response" body={(row) => truncateText(row.responsesFromCustomerSupport, 40)} />
              </DataTable>
            </div>
          )}
        </div>
      )}

      {hasSearched && !loading && !results && !error && (
        <div className="alert alert-info">
          ℹ No data to display
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading results...</p>
        </div>
      )}
    </div>
  )
}

export default SearchPage

