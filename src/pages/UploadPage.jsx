import { useState, useRef } from 'react'
import { uploadFile } from '../services/api'
import './UploadPage.css'

function UploadPage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [uploadResult, setUploadResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return false
    const validTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel']
    if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.json')) {
      setFile(selectedFile)
      setMessage('')
      return true
    }

    setMessage('Please select a CSV or JSON file')
    setMessageType('error')
    setFile(null)
    return false
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    validateAndSetFile(selectedFile)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const droppedFiles = e.dataTransfer?.files
    if (droppedFiles && droppedFiles.length > 0) {
      validateAndSetFile(droppedFiles[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      setMessage('Please select a file to upload')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await uploadFile(file)
      const { data } = response

      if (data.success) {
        setMessage(`✓ ${data.message}`)
        setMessageType('success')
        setUploadResult(data)
        setFile(null)
        document.getElementById('file-input').value = ''
      } else {
        setMessage(`✗ ${data.message}`)
        setMessageType('error')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed'
      setMessage(`✗ Error: ${errorMessage}`)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Upload Customer Interactions</h1>
      <p className="subtitle">Upload a CSV or JSON file containing customer interaction data</p>

      <div className="upload-section">
        <form onSubmit={handleSubmit} className="upload-form">
          <div
            className={`dropzone ${dragActive ? 'active' : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                fileInputRef.current?.click()
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {file ? (
              <div className="dropzone-content">✓ {file.name}</div>
            ) : (
              <div className="dropzone-content">Drag & drop a CSV/JSON file here, or click to select</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="file-input">Select File</label>
            <input
              id="file-input"
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".csv,.json"
              disabled={loading}
              className="file-input"
            />
            {file && <p className="file-selected">✓ {file.name}</p>}
          </div>

          <button 
            type="submit" 
            disabled={!file || loading}
            className="btn-primary"
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>

        {message && (
          <div className={`alert alert-${messageType}`}>
            {message}
          </div>
        )}

        {uploadResult && (
          <div className="upload-result card">
            <h3>Upload Summary</h3>
            <div className="result-row">
              <span className="label">Upload ID:</span>
              <span>{uploadResult.uploadJobId}</span>
            </div>
            <div className="result-row">
              <span className="label">Successfully Processed:</span>
              <span className="success-text">{uploadResult.processedRecords}</span>
            </div>
            <div className="result-row">
              <span className="label">Failed Records:</span>
              <span className={uploadResult.failedRecords > 0 ? 'error-text' : 'success-text'}>
                {uploadResult.failedRecords}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="format-guide">
        <h3>File Format Guide</h3>
        
        <div className="format-example">
          <h4>CSV Format</h4>
          <pre>{`product_id,customer_id,customer_rating,feedback,timestamp,responses_from_customer_support
PROD-001,CUST-001,5,"Great service!",2025-12-10T10:30:00,"Thank you!"
PROD-001,CUST-002,4,"Good support",2025-12-10T11:00:00,"Appreciated!"`}</pre>
        </div>

        <div className="format-example">
          <h4>JSON Format</h4>
          <pre>{`[
  {
    "product_id": "PROD-001",
    "customer_id": "CUST-001",
    "customer_rating": 5,
    "feedback": "Great service!",
    "timestamp": "2025-12-10T10:30:00",
    "responses_from_customer_support": "Thank you!"
  }
]`}</pre>
        </div>
      </div>
    </div>
  )
}

export default UploadPage
