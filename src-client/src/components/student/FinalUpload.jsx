import { useState } from 'react'
import toast from 'react-hot-toast'
import { projectsAPI } from '../../utils/api'
import FileUpload from '../common/FileUpload'
import LoadingSpinner from '../common/LoadingSpinner'

const FinalUpload = ({ project, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({
    report: null,
    presentation: null,
    code: null,
    images: null
  })

  const handleFileUpload = (fileType, fileData) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: fileData
    }))
  }

  const handleSubmit = async () => {
    // Check if at least report is uploaded
    if (!uploadedFiles.report) {
      toast.error('Please upload at least the final report')
      return
    }

    try {
      setUploading(true)
      
      console.log('🟡 Submitting files:', uploadedFiles)
      await projectsAPI.finalUpload(project._id, uploadedFiles)
      toast.success('Final documents uploaded successfully!')
      
      if (onUploadComplete) {
        onUploadComplete()
      }
      
      // Reset uploaded files
      setUploadedFiles({
        report: null,
        presentation: null,
        code: null,
        images: null
      })
      
    } catch (error) {
      console.error('❌ Error uploading final documents:', error)
      console.error('❌ Error response:', error.response?.data)
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Failed to upload final documents')
      }
    } finally {
      setUploading(false)
    }
  }

  const hasUploadedFile = (fileType) => {
    return uploadedFiles[fileType] !== null
  }

  return (
    <div className="final-upload-section">
      <h3>📄 Final Documents Upload</h3>
      <p className="section-description">
        Upload your final project deliverables. <strong>Final report is required.</strong> 
        Other files are optional but recommended.
      </p>

      <div className="upload-grid">
        <div className="upload-card required">
          <div className="upload-header">
            <h4>Final Report</h4>
            <span className="required-badge">Required</span>
          </div>
          <p>Upload your complete project report (PDF/DOC/DOCX)</p>
          <FileUpload
            onUploadComplete={(file) => handleFileUpload('report', file)}
            accept=".pdf,.doc,.docx"
            fileType="report"
            label="Choose Report"
            maxSize={10}
          />
          {hasUploadedFile('report') && (
            <div className="upload-success">
              ✅ Report uploaded successfully
            </div>
          )}
        </div>

        <div className="upload-card">
          <div className="upload-header">
            <h4>Presentation Slides</h4>
            <span className="optional-badge">Optional</span>
          </div>
          <p>Upload your presentation slides (PPT/PPTX/PDF)</p>
          <FileUpload
            onUploadComplete={(file) => handleFileUpload('presentation', file)}
            accept=".ppt,.pptx,.pdf"
            fileType="presentation"
            label="Choose Presentation"
            maxSize={20}
          />
          {hasUploadedFile('presentation') && (
            <div className="upload-success">
              ✅ Presentation uploaded successfully
            </div>
          )}
        </div>

        <div className="upload-card">
          <div className="upload-header">
            <h4>Source Code</h4>
            <span className="optional-badge">Optional</span>
          </div>
          <p>Upload your source code files (ZIP/RAR)</p>
          <FileUpload
            onUploadComplete={(file) => handleFileUpload('code', file)}
            accept=".zip,.rar,.7z"
            fileType="code"
            label="Choose Code Archive"
            maxSize={50}
          />
          {hasUploadedFile('code') && (
            <div className="upload-success">
              ✅ Source code uploaded successfully
            </div>
          )}
        </div>

        <div className="upload-card">
          <div className="upload-header">
            <h4>Project Images</h4>
            <span className="optional-badge">Optional</span>
          </div>
          <p>Upload project screenshots or photos (JPG/PNG)</p>
          <FileUpload
            onUploadComplete={(file) => handleFileUpload('images', file)}
            accept=".jpg,.jpeg,.png,.gif"
            fileType="images"
            label="Choose Images"
            maxSize={15}
          />
          {hasUploadedFile('images') && (
            <div className="upload-success">
              ✅ Images uploaded successfully
            </div>
          )}
        </div>
      </div>

      <div className="upload-summary">
        <h4>Upload Summary</h4>
        <div className="summary-list">
          <div className={`summary-item ${hasUploadedFile('report') ? 'completed' : 'pending'}`}>
            📄 Final Report: {hasUploadedFile('report') ? '✅ Uploaded' : '❌ Required'}
          </div>
          <div className={`summary-item ${hasUploadedFile('presentation') ? 'completed' : 'pending'}`}>
            📊 Presentation: {hasUploadedFile('presentation') ? '✅ Uploaded' : '⚪ Optional'}
          </div>
          <div className={`summary-item ${hasUploadedFile('code') ? 'completed' : 'pending'}`}>
            💾 Source Code: {hasUploadedFile('code') ? '✅ Uploaded' : '⚪ Optional'}
          </div>
          <div className={`summary-item ${hasUploadedFile('images') ? 'completed' : 'pending'}`}>
            🖼️ Project Images: {hasUploadedFile('images') ? '✅ Uploaded' : '⚪ Optional'}
          </div>
        </div>
      </div>

      <div className="upload-actions">
        <button
          onClick={handleSubmit}
          disabled={!hasUploadedFile('report') || uploading}
          className="btn btn-primary btn-large"
        >
          {uploading ? <LoadingSpinner size="small" /> : '📤 Submit Final Documents'}
        </button>
        
        <button
          onClick={() => setUploadedFiles({
            report: null,
            presentation: null,
            code: null,
            images: null
          })}
          className="btn btn-secondary"
        >
          ❌ Clear All
        </button>
      </div>

      <div className="upload-info">
        <p><strong>Note:</strong> Once you submit final documents, your project status will be marked as "Completed" 
        and will appear in the public projects repository. This action cannot be undone.</p>
      </div>
    </div>
  )
}

export default FinalUpload