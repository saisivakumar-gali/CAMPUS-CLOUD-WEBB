import ProjectCard from '../common/ProjectCard'

const FacultyDashboard = ({ 
  projects, 
  activeTab, 
  setActiveTab, 
  onStatusUpdate,
  stats 
}) => {
  return (
    <div className="faculty-dashboard">
      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.rejected}</div>
          <div className="stat-label">Not Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Projects</div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending Review
        </button>
        <button 
          className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          ✅ Approved
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          ❌ Not Approved
        </button>
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          📋 All Projects
        </button>
      </div>

      <div className="tab-content">
        {/* Pending Projects */}
        {activeTab === 'pending' && (
          <section className="projects-section">
            <h3 className="section-title">⏳ Projects Pending Review</h3>
            {projects.pending.length > 0 ? (
              <div className="projects-grid">
                {projects.pending.map(project => (
                  <ProjectCard 
                    key={project._id} 
                    project={project}
                    showStatus={true}
                    showActions={true}
                    onStatusUpdate={onStatusUpdate}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✅</div>
                <h3>No pending projects</h3>
                <p>All projects have been reviewed.</p>
              </div>
            )}
          </section>
        )}

        {/* Approved Projects */}
        {activeTab === 'approved' && (
          <section className="projects-section">
            <h3 className="section-title">✅ Approved Projects</h3>
            {projects.approved.length > 0 ? (
              <div className="projects-grid">
                {projects.approved.map(project => (
                  <ProjectCard 
                    key={project._id} 
                    project={project}
                    showStatus={true}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h3>No approved projects</h3>
                <p>Approved projects will appear here.</p>
              </div>
            )}
          </section>
        )}

        {/* Rejected Projects */}
        {activeTab === 'rejected' && (
          <section className="projects-section">
            <h3 className="section-title">❌ Not Approved Projects</h3>
            {projects.rejected.length > 0 ? (
              <div className="projects-grid">
                {projects.rejected.map(project => (
                  <ProjectCard 
                    key={project._id} 
                    project={project}
                    showStatus={true}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✅</div>
                <h3>No rejected projects</h3>
                <p>All projects have been approved.</p>
              </div>
            )}
          </section>
        )}

        {/* All Projects */}
        {activeTab === 'all' && (
          <section className="projects-section">
            <h3 className="section-title">📋 All Projects</h3>
            {projects.all.length > 0 ? (
              <div className="projects-grid">
                {projects.all.map(project => (
                  <ProjectCard 
                    key={project._id} 
                    project={project}
                    showStatus={true}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h3>No projects yet</h3>
                <p>Students haven't submitted any projects yet.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default FacultyDashboard