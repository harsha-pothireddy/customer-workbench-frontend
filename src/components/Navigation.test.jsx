import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navigation from './Navigation'

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Navigation', () => {
  it('renders the app title', () => {
    renderWithRouter(<Navigation />)
    expect(screen.getByText(/Customer Insights Workbench/i)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderWithRouter(<Navigation />)
    expect(screen.getByText(/Search/i)).toBeInTheDocument()
    expect(screen.getByText(/Upload/i)).toBeInTheDocument()
  })

  it('has correct href attributes for links', () => {
    renderWithRouter(<Navigation />)
    const searchLink = screen.getByText(/Search/i).closest('a')
    const uploadLink = screen.getByText(/Upload/i).closest('a')
    
    expect(searchLink).toHaveAttribute('href', '/search')
    expect(uploadLink).toHaveAttribute('href', '/upload')
  })

  it('app title links to home', () => {
    renderWithRouter(<Navigation />)
    const titleLink = screen.getByText(/Customer Insights Workbench/i).closest('a')
    expect(titleLink).toHaveAttribute('href', '/')
  })
})

