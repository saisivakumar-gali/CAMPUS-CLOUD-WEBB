import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import LoadingSpinner from './LoadingSpinner'

const FileUpload = ({ 
  onUploadComplete, 
  accept, 
  maxSize = 10, 
  label = "Choose File",
  fileType = "document"
}) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)

  const getAllowedExtensions = (type) => {
    const extensions = {
      report: ['.pdf', '.doc', '.docx'],
      presentation: ['.ppt', '.pptx', '.pdf'],
      code: ['.zip', '.rar', '.7z'],
      images: ['.jpg', '.jpeg', '.png', '.gif'],
      document: ['.pdf', '.doc', '.docx', '.txt']
    }
    return extensions[type] || extensions.document
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`)
      event.target.value = ''
      return
    }

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    const allowedExtensions = getAllowedExtensions(fileType)
    
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`)
      event.target.value = ''
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first')
      return
    }

    const formData = new FormData()
    formData.append('document', selectedFile)

    try {
      setUploading(true)
      setProgress(0)
      
      const token = localStorage.getItem('token')
      
      const response = await axios.post(
        'http://localhost:5000/api/upload/document',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              )
              setProgress(percent)
            }
          },
          timeout: 300000
        }
      )
      
      toast.success('File uploaded successfully!')
      onUploadComplete(response.data.file)
      setSelectedFile(null)
      
      // Reset file input
      const fileInput = document.getElementById(`file-upload-${fileType}`)
      if (fileInput) fileInput.value = ''
      
    } catch (error) {
      console.error('Upload failed:', error)
      if (error.code === 'ECONNABORTED') {
        toast.error('Upload timeout - file may be too large')
      } else if (error.response?.status === 413) {
        toast.error('File too large. Please choose a smaller file.')
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('File upload failed. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase()
    const icons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      ppt: '📊',
      pptx: '📊',
      zip: '📦',
      rar: '📦',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️'
    }
    return icons[ext] || '📁'
  }

  return (
    <div className="file-upload-component">
      <div className="file-input-group">
        <label htmlFor={`file-upload-${fileType}`} className="file-input-label">
          {label}
        </label>
        <input
          id={`file-upload-${fileType}`}
          type="file"
          onChange={handleFileSelect}
          accept={accept || getAllowedExtensions(fileType).join(',')}
          disabled={uploading}
          className="file-input"
        />
      </div>

      {selectedFile && (
        <div className="file-info">
          <div className="file-details">
            <span className="file-icon">
              {getFileIcon(selectedFile.name)}
            </span>
            <div className="file-meta">
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
          
          {!uploading ? (
            <button 
              onClick={handleUpload}
              className="btn btn-primary btn-sm"
            >
              Upload
            </button>
          ) : (
            <button 
              disabled
              className="btn btn-secondary btn-sm"
            >
              <LoadingSpinner size="small" />
            </button>
          )}
        </div>
      )}

      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
      )}
    </div>
  )
}

export default FileUpload