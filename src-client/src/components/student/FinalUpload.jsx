import { useState } from 'react'
import toast from 'react-hot-toast'
import { projectsAPI } from '../../utils/api'
import LoadingSpinner from '../common/LoadingSpinner'

const FinalUpload = ({ project, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false)
  const [uploadMethod, setUploadMethod] = useState('form')
  const [formData, setFormData] = useState({
    projectTitle: project.title || '',
    projectDomain: '',
    teamMembers: project.teamMembers?.map(member => member.name).join(', ') || '',
    guideName: project.facultyGuide?.firstName + ' ' + project.facultyGuide?.lastName || '',
    batchYear: project.submittedBy?.year || '',
    abstract: '',
    fullDescription: project.description || '',
    objectives: '',
    problemStatement: '',
    proposedSolution: '',
    finalOutput: '',
    performanceMetrics: '',
    conclusion: '',
    technologiesUsed: '',
    challengesFaced: '',
    futureEnhancements: ''
  })

  const PROJECT_DOMAINS = [
    'IoT (Internet of Things)',
    'Machine Learning / AI',
    'Web Development',
    'Mobile Development',
    'Embedded Systems',
    'Cloud Computing',
    'DevOps',
    'Data Science',
    'Cybersecurity',
    'Networking',
    'Robotics',
    'Computer Vision',
    'Natural Language Processing',
    'Blockchain',
    'AR/VR'
  ]

  // FIX: Prevent default form behavior and handle input properly
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // FIX: Proper form submission with event prevention
  const handleFormSubmit = async (e) => {
    if (e) {
      e.preventDefault() // Prevent form submission and page reload
    }

    // Validation
    if (!formData.projectDomain || !formData.abstract || !formData.objectives || 
        !formData.problemStatement || !formData.proposedSolution || !formData.finalOutput) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setUploading(true)
      
      const finalSubmission = {
        basicInfo: {
          projectTitle: formData.projectTitle,
          projectDomain: formData.projectDomain,
          teamMembers: formData.teamMembers.split(',').map(name => name.trim()).filter(name => name),
          guideName: formData.guideName,
          batchYear: formData.batchYear
        },
        description: {
          abstract: formData.abstract,
          fullDescription: formData.fullDescription,
          objectives: formData.objectives.split('\n').filter(obj => obj.trim()),
          problemStatement: formData.problemStatement,
          proposedSolution: formData.proposedSolution
        },
        technicalDetails: {
          finalOutput: formData.finalOutput,
          performanceMetrics: formData.performanceMetrics,
          conclusion: formData.conclusion,
          technologiesUsed: formData.technologiesUsed ? 
            formData.technologiesUsed.split(',').map(tech => tech.trim()).filter(tech => tech) : [],
          challengesFaced: formData.challengesFaced,
          futureEnhancements: formData.futureEnhancements
        }
      }

      await projectsAPI.submitFinalDetails(project._id, finalSubmission)
      toast.success('Project details submitted successfully!')
      
      if (onUploadComplete) {
        onUploadComplete()
      }
      
    } catch (error) {
      console.error('Error submitting project details:', error)
      toast.error(error.response?.data?.message || 'Failed to submit project details')
    } finally {
      setUploading(false)
    }
  }

  const isFormValid = () => {
    return formData.projectDomain && 
           formData.abstract && 
           formData.objectives && 
           formData.problemStatement && 
           formData.proposedSolution && 
           formData.finalOutput
  }

  const FormBasedUpload = () => (
    <form onSubmit={handleFormSubmit} className="project-form-container"> {/* FIX: Added form tag */}
      {/* Section 1: Basic Project Information */}
      <div className="form-section">
        <h4>🔹 1. Basic Project Information</h4>
        
        <div className="form-group">
          <label className="form-label">Project Title *</label>
          <input
            type="text"
            value={formData.projectTitle}
            onChange={(e) => handleInputChange('projectTitle', e.target.value)}
            className="form-input"
            placeholder="Enter project title"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Project Domain *</label>
          <select
            value={formData.projectDomain}
            onChange={(e) => handleInputChange('projectDomain', e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select Project Domain</option>
            {PROJECT_DOMAINS.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Team Members *</label>
            <input
              type="text"
              value={formData.teamMembers}
              onChange={(e) => handleInputChange('teamMembers', e.target.value)}
              className="form-input"
              placeholder="Enter team members separated by commas"
              required
            />
            <small className="form-help">Example: Janardhan, Ravi, Kiran</small>
          </div>

          <div className="form-group">
            <label className="form-label">Guide / Mentor Name *</label>
            <input
              type="text"
              value={formData.guideName}
              onChange={(e) => handleInputChange('guideName', e.target.value)}
              className="form-input"
              placeholder="Enter guide name"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Batch / Year *</label>
          <input
            type="text"
            value={formData.batchYear}
            onChange={(e) => handleInputChange('batchYear', e.target.value)}
            className="form-input"
            placeholder="Enter batch/year"
            required
          />
        </div>
      </div>

      {/* Section 2: Project Description */}
      <div className="form-section">
        <h4>🔹 2. Project Description</h4>
        
        <div className="form-group">
          <label className="form-label">Abstract / Summary *</label>
          <textarea
            value={formData.abstract}
            onChange={(e) => handleInputChange('abstract', e.target.value)}
            className="form-textarea"
            placeholder="Provide a 5-10 line summary of your project..."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Full Description</label>
          <textarea
            value={formData.fullDescription}
            onChange={(e) => handleInputChange('fullDescription', e.target.value)}
            className="form-textarea"
            placeholder="Detailed explanation of your project..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Objectives *</label>
          <textarea
            value={formData.objectives}
            onChange={(e) => handleInputChange('objectives', e.target.value)}
            className="form-textarea"
            placeholder="List your project objectives (one per line)..."
            rows="3"
            required
          />
          <small className="form-help">Enter each objective on a new line</small>
        </div>

        <div className="form-group">
          <label className="form-label">Problem Statement *</label>
          <textarea
            value={formData.problemStatement}
            onChange={(e) => handleInputChange('problemStatement', e.target.value)}
            className="form-textarea"
            placeholder="Describe the problem your project solves..."
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Proposed Solution *</label>
          <textarea
            value={formData.proposedSolution}
            onChange={(e) => handleInputChange('proposedSolution', e.target.value)}
            className="form-textarea"
            placeholder="Explain how your project solves the problem..."
            rows="3"
            required
          />
        </div>
      </div>

      {/* Section 3: Project Details */}
      <div className="form-section">
        <h4>🔹 3. Project Details</h4>
        
        <div className="form-group">
          <label className="form-label">Final Output Description *</label>
          <textarea
            value={formData.finalOutput}
            onChange={(e) => handleInputChange('finalOutput', e.target.value)}
            className="form-textarea"
            placeholder="Describe what your project delivers as final output..."
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Performance Metrics</label>
          <textarea
            value={formData.performanceMetrics}
            onChange={(e) => handleInputChange('performanceMetrics', e.target.value)}
            className="form-textarea"
            placeholder="Accuracy, speed, efficiency metrics..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Technologies Used</label>
          <input
            type="text"
            value={formData.technologiesUsed}
            onChange={(e) => handleInputChange('technologiesUsed', e.target.value)}
            className="form-input"
            placeholder="Enter technologies separated by commas"
          />
          <small className="form-help">Example: React, Node.js, MongoDB, Python</small>
        </div>

        <div className="form-group">
          <label className="form-label">Challenges Faced</label>
          <textarea
            value={formData.challengesFaced}
            onChange={(e) => handleInputChange('challengesFaced', e.target.value)}
            className="form-textarea"
            placeholder="Describe challenges you faced during development..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Future Enhancements</label>
          <textarea
            value={formData.futureEnhancements}
            onChange={(e) => handleInputChange('futureEnhancements', e.target.value)}
            className="form-textarea"
            placeholder="Potential improvements for future versions..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Conclusion</label>
          <textarea
            value={formData.conclusion}
            onChange={(e) => handleInputChange('conclusion', e.target.value)}
            className="form-textarea"
            placeholder="Final summary and learnings from the project..."
            rows="3"
          />
        </div>
      </div>

      <div className="upload-actions">
        <button
          type="submit" // FIX: Changed to submit type
          disabled={!isFormValid() || uploading}
          className="btn btn-primary btn-large"
        >
          {uploading ? <LoadingSpinner size="small" /> : '📤 Submit Final Project Details'}
        </button>
        
        <div className="form-validation">
          {!isFormValid() && (
            <p className="validation-warning">
              ⚠️ Please fill all required fields marked with *
            </p>
          )}
        </div>
      </div>
    </form>
  )

  const FileBasedUpload = () => (
    <div className="file-upload-section">
      <p>Use the existing file upload functionality to submit documents.</p>
      <button 
        type="button" // FIX: Explicit button type
        onClick={() => toast.info('File upload functionality is available in the original system')}
        className="btn btn-secondary"
      >
        Switch to File Upload
      </button>
    </div>
  )

  return (
    <div className="final-upload-section">
      <h3>📄 Final Project Submission</h3>
      <p className="section-description">
        Choose your submission method below:
      </p>

      {/* Method Selector */}
      <div className="upload-method-selector">
        <button 
          type="button" // FIX: Explicit button type
          className={`method-btn ${uploadMethod === 'form' ? 'active' : ''}`}
          onClick={() => setUploadMethod('form')}
        >
          📝 Submit Details Form
        </button>
        <button 
          type="button" // FIX: Explicit button type
          className={`method-btn ${uploadMethod === 'files' ? 'active' : ''}`}
          onClick={() => setUploadMethod('files')}
        >
          📁 Upload Documents
        </button>
      </div>

      {uploadMethod === 'form' ? <FormBasedUpload /> : <FileBasedUpload />}

      <div className="upload-info">
        <p><strong>Note:</strong> Form submission provides better searchability and organization of project information.</p>
      </div>
    </div>
  )
}

export default FinalUpload