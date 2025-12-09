import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Footer from '../components/common/Footer'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Navbar from '../components/common/Navbar'
import ProjectCard from '../components/common/ProjectCard'
import { projectsAPI } from '../utils/api'

const AllProjectsPage = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    department: '',
    domain: '',
    search: ''
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await projectsAPI.getApproved()
      setProjects(response.data.projects)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  // UPDATE the filteredProjects function (around line 30-50)
  const filteredProjects = projects.filter(project => {
    const matchesDepartment = !filters.department || project.branch === filters.department;
    const matchesDomain = !filters.domain || 
      (project.finalDetails?.basicInfo?.projectDomain?.includes(filters.domain));
    const matchesSearch = !filters.search || 
      project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.shortOverview.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.branch.toLowerCase().includes(filters.search.toLowerCase()) ||
      (project.finalDetails?.basicInfo?.projectDomain?.toLowerCase().includes(filters.search.toLowerCase())) ||
      (project.finalDetails?.basicInfo?.teamMembers?.some(member => 
        member.toLowerCase().includes(filters.search.toLowerCase())
      )) ||
      (project.finalDetails?.technicalDetails?.technologiesUsed?.some(tech => 
        tech.toLowerCase().includes(filters.search.toLowerCase())
      ));

    return matchesDepartment && matchesDomain && matchesSearch;
  });

  const departments = [...new Set(projects.map(p => p.branch))]
  
  // UPDATE domains extraction (around line 55)
  const domains = [...new Set(projects
    .map(p => p.finalDetails?.basicInfo?.projectDomain)
    .filter(domain => domain)
  )];

  if (loading) {
    return (
      <div className="all-projects-page">
        <Navbar />
        <div className="container">
          <LoadingSpinner size="large" text="Loading projects..." />
        </div>
      </div>
    )
  }

  return (
    <div className="all-projects-page">
      <Navbar />
      
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>📁 All Projects</h1>
          <p>Browse through completed and approved student projects with detailed information</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search projects, domains, team members, technologies..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="form-input"
              />
            </div>
            
            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              className="form-select"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filters.domain}
              onChange={(e) => setFilters(prev => ({ ...prev, domain: e.target.value }))}
              className="form-select"
            >
              <option value="">All Domains</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>

            <button
              onClick={() => setFilters({ department: '', domain: '', search: '' })}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-section">
          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No projects found</h3>
              <p>Try adjusting your search criteria or filters</p>
              <button
                onClick={() => setFilters({ department: '', domain: '', search: '' })}
                className="btn btn-primary"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="results-info">
                <p>Showing {filteredProjects.length} of {projects.length} projects</p>
                <div className="search-tips">
                  <small>💡 Search by project title, domain, team members, or technologies used</small>
                </div>
              </div>
              
              <div className="projects-grid">
                {filteredProjects.map(project => (
                  <ProjectCard 
                    key={project._id} 
                    project={project}
                    showStatus={true}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default AllProjectsPage