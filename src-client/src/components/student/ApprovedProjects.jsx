import ProjectCard from '../common/ProjectCard'

const ApprovedProjects = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✅</div>
        <h3>No approved projects</h3>
        <p>Your approved projects will appear here once they are reviewed by faculty.</p>
      </div>
    )
  }

  return (
    <div className="projects-section">
      <h3 className="section-title">✅ Approved Projects</h3>
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard 
            key={project._id} 
            project={project}
            showStatus={true}
          />
        ))}
      </div>
    </div>
  )
}

export default ApprovedProjects