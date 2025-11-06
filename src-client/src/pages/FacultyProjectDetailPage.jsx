import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Footer from '../components/common/Footer'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Navbar from '../components/common/Navbar'
import { useAuth } from '../context/AuthContext'
import { projectsAPI } from '../utils/api'

const FacultyProjectDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [remarks, setRemarks] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await projectsAPI.getById(id)
      setProject(response.data.project)
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Failed to load project details')
      navigate('/faculty/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (status) => {
    if (status === 'rejected' && !remarks.trim()) {
      toast.error('Please provide remarks for rejection')
      return
    }

    setActionLoading(true)
    try {
      await projectsAPI.updateStatus(id, { status, remarks })
      toast.success(`Project ${status} successfully!`)
      fetchProject() // Refresh project data
      setRemarks('')
    } catch (error) {
      console.error('Error updating project status:', error)
      toast.error('Failed to update project status')
    } finally {
      setActionLoading(false)
    }
  }

  const downloadFile = async (fileType, fileName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/upload/download/${fileType}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName || `${fileType}_${project.title}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('File download started')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download file')
    }
  }

  if (loading) {
    return (
      <div className="project-detail-page">
        <Navbar />
        <div className="container">
          <LoadingSpinner size="large" text="Loading project details..." />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="project-detail-page">
        <Navbar />
        <div className="container">
          <div className="error-state">
            <h2>Project not found</h2>
            <button onClick={() => navigate('/faculty/dashboard')} className="btn btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="faculty-project-detail-page">
      <Navbar />
      
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/faculty/dashboard" className="breadcrumb-link">Faculty Dashboard</Link>
          <span className="breadcrumb-separator">/</span>
          <span>Project Details</span>
        </div>

        <div className="review-container">
          {/* Project Details */}
          <div className="project-details-section">
            <div className="project-header">
              <div className="project-title-section">
                <h1 className="project-title">{project.title}</h1>
                <span className={`status-badge ${project.status}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
              <div className="project-meta">
                {project.category} • {project.branch} • Submitted by {project.submittedBy?.firstName} {project.submittedBy?.lastName}
              </div>
            </div>

            {/* Tabs */}
            <div className="project-detail-tabs">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                📋 Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
                onClick={() => setActiveTab('team')}
              >
                👥 Team
              </button>
              <button 
                className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                📄 Documents
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="detail-grid">
                  <div className="detail-card">
                    <h3>Project Overview</h3>
                    <p className="overview-text">{project.shortOverview}</p>
                  </div>
                  
                  <div className="detail-card full-width">
                    <h3>Detailed Description</h3>
                    <div className="description-content">
                      {project.description}
                    </div>
                  </div>

                  <div className="detail-card">
                    <h3>Project Information</h3>
                    <div className="detail-list">
                      <div className="detail-item">
                        <span>Category:</span>
                        <span>{project.category}</span>
                      </div>
                      <div className="detail-item">
                        <span>Branch:</span>
                        <span>{project.branch}</span>
                      </div>
                      <div className="detail-item">
                        <span>Status:</span>
                        <span className={`status-badge ${project.status}`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span>Submitted On:</span>
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {project.facultyRemarks && (
                    <div className="detail-card full-width">
                      <h3>Faculty Remarks</h3>
                      <div className="remarks-content">
                        {project.facultyRemarks}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'team' && (
                <div className="team-tab">
                  <div className="detail-card">
                    <h3>Project Team</h3>
                    <div className="team-members-list">
                      <div className="team-member-item primary">
                        <div className="member-number">1</div>
                        <div className="member-details">
                          <strong>Team Lead</strong>
                          <span>{project.submittedBy?.firstName} {project.submittedBy?.lastName}</span>
                          <span>ID: {project.submittedBy?.collegeId}</span>
                        </div>
                      </div>
                      
                      {project.teamMembers?.map((member, index) => (
                        <div key={index} className="team-member-item">
                          <div className="member-number">{index + 2}</div>
                          <div className="member-details">
                            <strong>{member.name}</strong>
                            <span>ID: {member.studentId}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="documents-tab">
                  <div className="detail-card">
                    <h3>Project Documents</h3>
                    {project.finalDocuments ? (
                      <div className="documents-grid">
                        {project.finalDocuments.report && (
                          <div className="document-card">
                            <div className="document-icon">📄</div>
                            <div className="document-info">
                              <h4>Final Report</h4>
                              <p>Submitted project report document</p>
                              <button 
                                onClick={() => downloadFile('report', `Report_${project.title}.pdf`)}
                                className="btn btn-primary btn-sm"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        )}
                        {project.finalDocuments.presentation && (
                          <div className="document-card">
                            <div className="document-icon">📊</div>
                            <div className="document-info">
                              <h4>Presentation</h4>
                              <p>Project presentation slides</p>
                              <button 
                                onClick={() => downloadFile('presentation', `Presentation_${project.title}.pptx`)}
                                className="btn btn-primary btn-sm"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        )}
                        {project.finalDocuments.code && (
                          <div className="document-card">
                            <div className="document-icon">💾</div>
                            <div className="document-info">
                              <h4>Source Code</h4>
                              <p>Project source code files</p>
                              <button 
                                onClick={() => downloadFile('code', `Code_${project.title}.zip`)}
                                className="btn btn-primary btn-sm"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <div className="empty-icon">📁</div>
                        <h4>No documents uploaded yet</h4>
                        <p>Student hasn't uploaded final documents</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Sidebar */}
          {project.status === 'pending' && (
            <div className="review-sidebar">
              <div className="action-card">
                <h3>Project Review</h3>
                
                <div className="remarks-section">
                  <label htmlFor="faculty-remarks" className="form-label">
                    Remarks & Feedback
                  </label>
                  <textarea
                    id="faculty-remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="form-textarea"
                    placeholder="Provide constructive feedback for the student..."
                    rows="6"
                  />
                </div>

                <div className="action-buttons">
                  <button
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={actionLoading}
                    className="btn btn-success"
                  >
                    ✅ Approve Project
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={actionLoading || !remarks.trim()}
                    className="btn btn-error"
                  >
                    ❌ Reject Project
                  </button>
                </div>

                <div className="action-info">
                  <p><strong>Note:</strong> Remarks are required when rejecting a project. 
                  Approved projects will be visible in the public repository.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="navigation-actions">
          <button 
            onClick={() => navigate('/faculty/dashboard')}
            className="btn btn-secondary"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default FacultyProjectDetailPage