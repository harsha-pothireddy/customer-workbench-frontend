import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SearchPage from './SearchPage'
import * as api from '../services/api'

// Mock the API module
vi.mock('../services/api', () => ({
  searchInteractions: vi.fn(),
}))

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the page title', () => {
    renderWithRouter(<SearchPage />)
    expect(screen.getByText(/Search Customer Interactions/i)).toBeInTheDocument()
  })

  it('renders search form fields', () => {
    renderWithRouter(<SearchPage />)
    expect(screen.getByLabelText(/Customer ID/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Interaction Type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument()
    expect(screen.getByText(/Search/i)).toBeInTheDocument()
  })

  it('updates customer ID input value', async () => {
    renderWithRouter(<SearchPage />)
    const customerIdInput = screen.getByLabelText(/Customer ID/i)
    
    fireEvent.change(customerIdInput, { target: { value: 'CUST-001' } })
    
    expect(customerIdInput).toHaveValue('CUST-001')
  })

  it('updates interaction type select value', async () => {
    renderWithRouter(<SearchPage />)
    const interactionTypeSelect = screen.getByLabelText(/Interaction Type/i)
    
    fireEvent.change(interactionTypeSelect, { target: { value: 'email' } })
    
    expect(interactionTypeSelect).toHaveValue('email')
  })

  it('calls search API on form submit', async () => {
    const mockSearchResponse = {
      data: {
        interactions: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 5,
      },
    }

    api.searchInteractions.mockResolvedValue(mockSearchResponse)

    renderWithRouter(<SearchPage />)
    const searchButton = screen.getByText(/Search/i)
    
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(api.searchInteractions).toHaveBeenCalled()
    })
  })

  it('displays search results after successful search', async () => {
    const mockSearchResponse = {
      data: {
        interactions: [
          {
            customerId: 'CUST-001',
            interactionType: 'email',
            timestamp: '2025-12-10T10:30:00',
            feedback: 'Great service!',
            responsesFromCustomerSupport: 'Thank you!',
          },
        ],
        totalElements: 1,
        totalPages: 1,
        currentPage: 0,
        pageSize: 5,
      },
    }

    api.searchInteractions.mockResolvedValue(mockSearchResponse)

    renderWithRouter(<SearchPage />)
    const searchButton = screen.getByText(/Search/i)
    
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText(/Results/i)).toBeInTheDocument()
      expect(screen.getByText(/1 total/i)).toBeInTheDocument()
    })
  })

  it('displays error message on search failure', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Search failed: Server error',
        },
      },
    }

    api.searchInteractions.mockRejectedValue(mockError)

    renderWithRouter(<SearchPage />)
    const searchButton = screen.getByText(/Search/i)
    
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText(/Search failed: Server error/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during search', async () => {
    // Create a promise that we can control
    let resolvePromise
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    api.searchInteractions.mockReturnValue(promise)

    renderWithRouter(<SearchPage />)
    const searchButton = screen.getByText(/Search/i)
    
    fireEvent.click(searchButton)

    // Check for loading state
    await waitFor(() => {
      expect(screen.getByText(/Searching.../i)).toBeInTheDocument()
    })

    // Resolve the promise
    resolvePromise({
      data: {
        interactions: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 5,
      },
    })

    await waitFor(() => {
      expect(screen.queryByText(/Searching.../i)).not.toBeInTheDocument()
    })
  })
})

