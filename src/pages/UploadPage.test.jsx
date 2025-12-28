import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UploadPage from './UploadPage'
import * as api from '../services/api'

// Mock the API module
vi.mock('../services/api', () => ({
  uploadFile: vi.fn(),
}))

describe('UploadPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the page title', () => {
    render(<UploadPage />)
    expect(screen.getByText(/Upload Customer Interactions/i)).toBeInTheDocument()
  })

  it('renders the file input', () => {
    render(<UploadPage />)
    const fileInput = screen.getByLabelText(/Select File/i)
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('type', 'file')
  })

  it('renders the upload button', () => {
    render(<UploadPage />)
    const uploadButton = screen.getByText(/Upload File/i)
    expect(uploadButton).toBeInTheDocument()
    expect(uploadButton).toBeDisabled() // Should be disabled when no file is selected
  })

  it('shows drag and drop zone', () => {
    render(<UploadPage />)
    expect(screen.getByText(/Drag & drop a CSV\/JSON file here/i)).toBeInTheDocument()
  })

  it('validates file type on file selection', async () => {
    render(<UploadPage />)
    const fileInput = screen.getByLabelText(/Select File/i)

    // Create an invalid file (e.g., PDF)
    const invalidFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    
    fireEvent.change(fileInput, { target: { files: [invalidFile] } })

    await waitFor(() => {
      expect(screen.getByText(/Please select a CSV or JSON file/i)).toBeInTheDocument()
    })
  })

  it('validates file size', async () => {
    render(<UploadPage />)
    const fileInput = screen.getByLabelText(/Select File/i)

    // Create a file that exceeds the maximum size (11MB, max is 10MB)
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.csv', { type: 'text/csv' })
    
    fireEvent.change(fileInput, { target: { files: [largeFile] } })

    await waitFor(() => {
      expect(screen.getByText(/exceeds maximum allowed size/i)).toBeInTheDocument()
    })
  })

  it('enables upload button when valid file is selected', async () => {
    render(<UploadPage />)
    const fileInput = screen.getByLabelText(/Select File/i)

    const validFile = new File(['customer_id,feedback'], 'test.csv', { type: 'text/csv' })
    fireEvent.change(fileInput, { target: { files: [validFile] } })

    await waitFor(() => {
      const uploadButton = screen.getByText(/Upload File/i)
      expect(uploadButton).not.toBeDisabled()
    })
  })

  it('handles successful file upload', async () => {
    const mockUploadResponse = {
      data: {
        success: true,
        message: 'Upload processed',
        uploadJobId: 123,
        processedRecords: 42,
        failedRecords: 0,
      },
    }

    api.uploadFile.mockResolvedValue(mockUploadResponse)

    render(<UploadPage />)
    const fileInput = screen.getByLabelText(/Select File/i)
    const uploadButton = screen.getByText(/Upload File/i)

    const validFile = new File(['customer_id,feedback'], 'test.csv', { type: 'text/csv' })
    fireEvent.change(fileInput, { target: { files: [validFile] } })

    await waitFor(() => {
      expect(uploadButton).not.toBeDisabled()
    })

    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(api.uploadFile).toHaveBeenCalledWith(validFile)
      expect(screen.getByText(/Upload processed/i)).toBeInTheDocument()
      expect(screen.getByText(/Upload Summary/i)).toBeInTheDocument()
      expect(screen.getByText(/123/i)).toBeInTheDocument() // Upload ID
    })
  })

  it('handles upload error', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Upload failed: Invalid file format',
        },
      },
    }

    api.uploadFile.mockRejectedValue(mockError)

    render(<UploadPage />)
    const fileInput = screen.getByLabelText(/Select File/i)
    const uploadButton = screen.getByText(/Upload File/i)

    const validFile = new File(['customer_id,feedback'], 'test.csv', { type: 'text/csv' })
    fireEvent.change(fileInput, { target: { files: [validFile] } })

    await waitFor(() => {
      expect(uploadButton).not.toBeDisabled()
    })

    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(screen.getByText(/Upload failed: Invalid file format/i)).toBeInTheDocument()
    })
  })
})

