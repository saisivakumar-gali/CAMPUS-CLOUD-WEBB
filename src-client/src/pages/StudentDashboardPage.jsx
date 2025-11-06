import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Footer from '../components/common/Footer'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Navbar from '../components/common/Navbar'
import FinalUpload from '../components/student/FinalUpload'
import ProjectUpload from '../components/student/ProjectUpload'
import StudentDashboard from '../components/student/StudentDashboard'
import { useAuth } from '../context/AuthContext'
import { projectsAPI, usersAPI } from '../utils/api'

const StudentDashboardPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState({
    pending: [],
    approved: [],
    rejected: [],
    all: []
  })
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: '',
    branch: '',
    shortOverview: '',
    description: '',
    facultyGuide: '',
    teamMembers: [{ name: '', studentId: '' }]
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [projectsRes, facultyRes] = await Promise.all([
        projectsAPI.getAll(),
        usersAPI.getFaculty()
      ])
      
      const studentProjects = projectsRes.data.projects
      setProjects({
        pending: studentProjects.filter(p => p.status === 'pending'),
        approved: studentProjects.filter(p => p.status === 'approved'),
        rejected: studentProjects.filter(p => p.status === 'rejected'),
        all: studentProjects
      })
      
      setFaculty(facultyRes.data.faculty)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadFormChange = (field, value) => {
    setUploadForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...uploadForm.teamMembers]
    updatedMembers[index][field] = value
    setUploadForm(prev => ({
      ...prev,
      teamMembers: updatedMembers
    }))
  }

  const addTeamMember = () => {
    if (uploadForm.teamMembers.length < 4) {
      setUploadForm(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, { name: '', studentId: '' }]
      }))
    }
  }

  const removeTeamMember = (index) => {
    if (uploadForm.teamMembers.length > 1) {
      const updatedMembers = uploadForm.teamMembers.filter((_, i) => i !== index)
      setUploadForm(prev => ({
        ...prev,
        teamMembers: updatedMembers
      }))
    }
  }

  const handleProjectSubmit = async () => {
    try {
      // Validate required fields
      if (!uploadForm.title || !uploadForm.category || !uploadForm.branch || 
          !uploadForm.shortOverview || !uploadForm.description || !uploadForm.facultyGuide) {
        toast.error('Please fill all required fields')
        return
      }

      // Validate description length
      if (uploadForm.description.length < 50) {
        toast.error('Description must be at least 50 characters long')
        return
      }

      await projectsAPI.create(uploadForm)
      toast.success('Project submitted successfully!')
      
      // Reset form
      setUploadForm({
        title: '',
        category: '',
        branch: '',
        shortOverview: '',
        description: '',
        facultyGuide: '',
        teamMembers: [{ name: '', studentId: '' }]
      })
      
      // Refresh projects
      fetchData()
      setActiveTab('overview')
      
    } catch (error) {
      console.error('Error submitting project:', error.response?.data)
      
      // SHOW SPECIFIC VALIDATION ERRORS
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err.msg))
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Failed to submit project')
      }
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="container">
          <LoadingSpinner size="large" text="Loading dashboard..." />
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="container">
        {/* Student Info Card */}
        <div className="student-info-card">
          <div className="student-avatar">🎓</div>
          <div className="student-details">
            <h2>{user.firstName} {user.lastName}</h2>
            <p>College ID: {user.collegeId} | {user.department} | {user.year}</p>
            <p>Role: Student</p>
          </div>
          <div className="student-stats">
            <div className="stat">
              <span className="stat-number">{projects.pending.length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat">
              <span className="stat-number">{projects.approved.length}</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat">
              <span className="stat-number">{projects.all.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <StudentDashboard 
          projects={projects}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Upload Project Tab Content */}
        {activeTab === 'upload' && (
          <div id="upload">
            <ProjectUpload 
              uploadForm={uploadForm}
              handleUploadFormChange={handleUploadFormChange}
              handleTeamMemberChange={handleTeamMemberChange}
              addTeamMember={addTeamMember}
              removeTeamMember={removeTeamMember}
              faculty={faculty}
            />
            
            <div className="form-actions">
              <button 
                onClick={handleProjectSubmit}
                className="btn btn-primary btn-large"
              >
                📤 Submit Project Proposal
              </button>
              <button 
                onClick={() => setUploadForm({
                  title: '',
                  category: '',
                  branch: '',
                  shortOverview: '',
                  description: '',
                  facultyGuide: '',
                  teamMembers: [{ name: '', studentId: '' }]
                })}
                className="btn btn-secondary"
              >
                ❌ Clear Form
              </button>
            </div>
          </div>
        )}

        {/* Final Upload Tab Content */}
        {activeTab === 'final' && (
          <div className="final-upload-tab">
            <h3 className="section-title">📄 Final Documents Upload</h3>
            
            {projects.approved.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h3>No approved projects</h3>
                <p>You need an approved project to upload final documents.</p>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className="btn btn-primary"
                >
                  Submit Project Proposal
                </button>
              </div>
            ) : (
              <div className="approved-projects-list">
                {projects.approved.map(project => (
                  <div key={project._id} className="project-select-card">
                    <div className="project-info">
                      <h5>{project.title}</h5>
                      <p className="project-overview">{project.shortOverview}</p>
                      <div className="project-meta">
                        <span>{project.category}</span>
                        <span>{project.branch}</span>
                        <span>Guide: {project.facultyGuide?.firstName} {project.facultyGuide?.lastName}</span>
                      </div>
                    </div>
                    
                    {!project.finalDocuments?.report ? (
                      <FinalUpload 
                        project={project}
                        onUploadComplete={fetchData}
                      />
                    ) : (
                      <div className="upload-completed">
                        <div className="upload-success">
                          ✅ Final documents already submitted
                        </div>
                        <div className="uploaded-files">
                          <strong>Uploaded Files:</strong>
                          <div className="file-list">
                            {project.finalDocuments.report && <span>📄 Report</span>}
                            {project.finalDocuments.presentation && <span>📊 Presentation</span>}
                            {project.finalDocuments.code && <span>💾 Code</span>}
                            {project.finalDocuments.images && <span>🖼️ Images</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

export default StudentDashboardPage