import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Footer from '../components/common/Footer'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Navbar from '../components/common/Navbar'
import { useAuth } from '../context/AuthContext'
import { projectsAPI } from '../utils/api'

const ProjectDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
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
      navigate('/projects')
    } finally {
      setLoading(false)
    }
  }

  const downloadFile = async (fileType, fileName) => {
    if (!isAuthenticated) {
      toast.error('Please login to download files')
      navigate('/login')
      return
    }

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
            <button onClick={() => navigate('/projects')} className="btn btn-primary">
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="project-detail-page">
      <Navbar />
      
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/projects" className="breadcrumb-link">All Projects</Link>
          <span className="breadcrumb-separator">/</span>
          <span>Project Details</span>
        </div>

        <div className="project-header">
          <div className="project-title-section">
            <h1 className="project-title">{project.title}</h1>
            <span className={`status-badge ${project.status}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
          <div className="project-meta">
            {project.category} • {project.branch} • {project.submittedBy?.year} Year
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
                    <span>Faculty Guide:</span>
                    <span>
                      {project.facultyGuide 
                        ? `Prof. ${project.facultyGuide.firstName} ${project.facultyGuide.lastName}`
                        : 'Not assigned'
                      }
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
                  <h3>Faculty Feedback</h3>
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
                <div className="team-grid">
                  <div className="team-card">
                    <h4>Team Lead</h4>
                    <div className="team-member primary">
                      <div className="member-avatar">👤</div>
                      <div className="member-info">
                        <strong>{project.submittedBy?.firstName} {project.submittedBy?.lastName}</strong>
                        <span>ID: {project.submittedBy?.collegeId}</span>
                        <span>{project.submittedBy?.year} Year</span>
                      </div>
                    </div>
                  </div>

                  {project.teamMembers && project.teamMembers.length > 0 && (
                    <div className="team-card">
                      <h4>Team Members</h4>
                      {project.teamMembers.map((member, index) => (
                        <div key={index} className="team-member">
                          <div className="member-avatar">👥</div>
                          <div className="member-info">
                            <strong>{member.name}</strong>
                            <span>ID: {member.studentId}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                          <p>Complete project documentation and analysis</p>
                          <button 
                            onClick={() => downloadFile('report', `Report_${project.title}.pdf`)}
                            className="btn btn-primary btn-sm"
                          >
                            {isAuthenticated ? 'Download' : 'Login to Download'}
                          </button>
                        </div>
                      </div>
                    )}
                    {project.finalDocuments.presentation && (
                      <div className="document-card">
                        <div className="document-icon">📊</div>
                        <div className="document-info">
                          <h4>Presentation</h4>
                          <p>Project presentation slides and materials</p>
                          <button 
                            onClick={() => downloadFile('presentation', `Presentation_${project.title}.pptx`)}
                            className="btn btn-primary btn-sm"
                          >
                            {isAuthenticated ? 'Download' : 'Login to Download'}
                          </button>
                        </div>
                      </div>
                    )}
                    {project.finalDocuments.code && (
                      <div className="document-card">
                        <div className="document-icon">💾</div>
                        <div className="document-info">
                          <h4>Source Code</h4>
                          <p>Complete source code and implementation</p>
                          <button 
                            onClick={() => downloadFile('code', `Code_${project.title}.zip`)}
                            className="btn btn-primary btn-sm"
                          >
                            {isAuthenticated ? 'Download' : 'Login to Download'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📁</div>
                    <h4>No documents available</h4>
                    <p>Final documents haven't been uploaded yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            onClick={() => navigate('/projects')}
            className="btn btn-secondary"
          >
            ← Back to Projects
          </button>
          
          {isAuthenticated && user.role === 'faculty' && project.status === 'pending' && (
            <Link 
              to={`/faculty/projects/${project._id}`}
              className="btn btn-primary"
            >
              👨‍🏫 Review Project
            </Link>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default ProjectDetailPage