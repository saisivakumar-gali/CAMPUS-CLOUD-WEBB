import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Footer from '../components/common/Footer'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Navbar from '../components/common/Navbar'
import FacultyDashboard from '../components/faculty/FacultyDashboard'
import { useAuth } from '../context/AuthContext'
import { projectsAPI } from '../utils/api'

const FacultyDashboardPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('pending')
  const [projects, setProjects] = useState({
    pending: [],
    approved: [],
    rejected: [],
    all: []
  })
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await projectsAPI.getAll()
      const allProjects = response.data.projects
      
      const pending = allProjects.filter(p => p.status === 'pending')
      const approved = allProjects.filter(p => p.status === 'approved')
      const rejected = allProjects.filter(p => p.status === 'rejected')

      setProjects({
        pending,
        approved,
        rejected,
        all: allProjects
      })

      setStats({
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
        total: allProjects.length
      })
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (projectId, status, remarks = '') => {
    try {
      await projectsAPI.updateStatus(projectId, { status, remarks })
      toast.success(`Project ${status} successfully!`)
      fetchProjects() // Refresh the list
    } catch (error) {
      console.error('Error updating project status:', error)
      toast.error('Failed to update project status')
      throw error
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="container">
          <LoadingSpinner size="large" text="Loading faculty dashboard..." />
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="container">
        {/* Faculty Info Card */}
        <div className="faculty-info-card">
          <div className="faculty-avatar">👨‍🏫</div>
          <div className="faculty-details">
            <h2>Prof. {user.firstName} {user.lastName}</h2>
            <p>{user.designation} | {user.department} Department</p>
            <p>Role: Faculty Mentor</p>
          </div>
          <div className="faculty-stats">
            <div className="stat">
              <span className="stat-number">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat">
              <span className="stat-number">{stats.approved}</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>

        {/* Faculty Dashboard */}
        <FacultyDashboard 
          projects={projects}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onStatusUpdate={handleStatusUpdate}
          stats={stats}
        />
      </div>
      
      <Footer />
    </div>
  )
}

export default FacultyDashboardPage