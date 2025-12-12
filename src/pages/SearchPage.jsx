import { useState, useEffect, useCallback } from 'react'
import { searchInteractions } from '../services/api'
import './SearchPage.css'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'

function SearchPage() {
  const [filters, setFilters] = useState({
    customerId: '',
    interactionType: '',
    startDate: '',
    endDate: '',
    page: 0,
    size: 5,
  })

  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 0, // Reset to first page on filter change
    }))
  }

  const fetchResults = useCallback(async (currentFilters) => {
    setLoading(true)
    setError('')
    setHasSearched(true)

    try {
      const response = await searchInteractions(currentFilters)
      setResults(response.data)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Search failed')
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchResults(filters)
  }

  const handlePageChange = (event) => {
    const newFilters = {
      ...filters,
      page: event.page,
      size: event.rows,
    }
    setFilters(newFilters)
    fetchResults(newFilters)
  }

  const handleFilterChangeFromTable = (event) => {
    // event.filters: { field: { value, matchMode } }
    const tableFilters = event.filters || {}
    const newFilters = { ...filters }

    if (tableFilters.customerId && tableFilters.customerId.value !== undefined) {
      newFilters.customerId = tableFilters.customerId.value
    }

    if (tableFilters.interactionType && tableFilters.interactionType.value !== undefined) {
      newFilters.interactionType = tableFilters.interactionType.value
    }

    // For other columns like feedback we can map to a free-text search param if backend supports it

    newFilters.page = 0
    setFilters(newFilters)
    fetchResults(newFilters)
  }

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '-'
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
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
                <Column field="interactionType" header="Interaction Type" filter filterField="interactionType" filterElement={(options) => (
                  <Dropdown value={options.value} options={[{label:'',value:''},{label:'email',value:'email'},{label:'chat',value:'chat'},{label:'ticket',value:'ticket'},{label:'feedback',value:'feedback'}]} onChange={(e) => options.filterCallback(e.value)} placeholder="Select"/>
                )} />
                
                <Column field="feedback" header="Feedback" body={(row) => truncateText(row.feedback,40)} filter filterField="feedback"/>
                <Column field="responsesFromCustomerSupport" header="Response" body={(row) => truncateText(row.responsesFromCustomerSupport,40)} />
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
