import ProjectCard from '../common/ProjectCard'

const StudentDashboard = ({ projects, activeTab, setActiveTab }) => {
  return (
    <div className="student-dashboard">
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload Project
        </button>
        <button 
          className={`tab-btn ${activeTab === 'final' ? 'active' : ''}`}
          onClick={() => setActiveTab('final')}
        >
          📄 Final Upload
        </button>
      </div>

      <div className="tab-content">
        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Approved Projects */}
            {projects.approved.length > 0 && (
              <section className="projects-section">
                <h3 className="section-title">✅ Approved Projects</h3>
                <div className="projects-grid">
                  {projects.approved.map(project => (
                    <ProjectCard 
                      key={project._id} 
                      project={project}
                      showStatus={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Pending Projects */}
            {projects.pending.length > 0 && (
              <section className="projects-section">
                <h3 className="section-title">⏳ Pending Approval</h3>
                <div className="projects-grid">
                  {projects.pending.map(project => (
                    <ProjectCard 
                      key={project._id} 
                      project={project}
                      showStatus={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Rejected Projects */}
            {projects.rejected.length > 0 && (
              <section className="projects-section">
                <h3 className="section-title">❌ Not Approved</h3>
                <div className="projects-grid">
                  {projects.rejected.map(project => (
                    <ProjectCard 
                      key={project._id} 
                      project={project}
                      showStatus={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {projects.approved.length === 0 && projects.pending.length === 0 && projects.rejected.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h3>No projects yet</h3>
                <p>Start by uploading your first project proposal</p>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className="btn btn-primary"
                >
                  Upload Project
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard