import ProjectCard from '../common/ProjectCard'

const PendingProjects = ({ projects, onStatusUpdate }) => {
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✅</div>
        <h3>No pending projects</h3>
        <p>All projects have been reviewed and approved.</p>
      </div>
    )
  }

  return (
    <div className="pending-projects">
      <div className="section-header">
        <h3 className="section-title">⏳ Projects Pending Review ({projects.length})</h3>
        <p className="section-description">
          Review and approve student project proposals. Click "View Details" for comprehensive review.
        </p>
      </div>
      
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard 
            key={project._id} 
            project={project}
            showStatus={true}
            showActions={true}
            onStatusUpdate={onStatusUpdate}
          />
        ))}
      </div>
    </div>
  )
}

export default PendingProjects