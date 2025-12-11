import { useState, useEffect } from 'react'
import { searchInteractions } from '../services/api'
import './SearchPage.css'

function SearchPage() {
  const [filters, setFilters] = useState({
    customerId: '',
    interactionType: '',
    startDate: '',
    endDate: '',
    page: 0,
    size: 10,
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

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setHasSearched(true)

    try {
      const response = await searchInteractions(filters)
      setResults(response.data)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Search failed')
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }))
    handleSearch({ preventDefault: () => {} })
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
            <>
              <div className="table-wrapper">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Customer ID</th>
                      <th>Interaction Type</th>
                      <th>Rating</th>
                      <th>Feedback</th>
                      <th>Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.interactions.map((interaction) => (
                      <tr key={interaction.id}>
                        <td>{formatDate(interaction.timestamp)}</td>
                        <td className="customer-id">{interaction.customerId}</td>
                        <td>
                          <span className={`badge badge-${interaction.interactionType}`}>
                            {interaction.interactionType}
                          </span>
                        </td>
                        <td className="rating">
                          {interaction.customerRating ? `${interaction.customerRating}/5` : '-'}
                        </td>
                        <td className="feedback" title={interaction.feedback}>
                          {truncateText(interaction.feedback, 40)}
                        </td>
                        <td className="response" title={interaction.responsesFromCustomerSupport}>
                          {truncateText(interaction.responsesFromCustomerSupport, 40)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {results.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(results.currentPage - 1)}
                    disabled={results.currentPage === 0}
                    className="btn-page"
                  >
                    ← Previous
                  </button>

                  <span className="page-info">
                    Page {results.currentPage + 1} of {results.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(results.currentPage + 1)}
                    disabled={results.currentPage >= results.totalPages - 1}
                    className="btn-page"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
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
