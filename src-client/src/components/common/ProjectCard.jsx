import { Link } from 'react-router-dom'
import { STATUS_COLORS, STATUS_LABELS } from '../../utils/constants'

const ProjectCard = ({ project, showStatus = false, showActions = false, onStatusUpdate }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Hardware': return '⚙️'
      case 'Software': return '💻'
      case 'Research': return '🔬'
      default: return '📁'
    }
  }

  const getDepartmentIcon = (branch) => {
    switch (branch) {
      case 'CSE': return '💻'
      case 'ECE': return '📡'
      case 'EEE': return '⚡'
      case 'MECH': return '🔧'
      case 'CIVIL': return '🏗️'
      case 'BUSINESS': return '📊'
      case 'ARTS': return '🎨'
      case 'SCIENCE': return '🔬'
      default: return '🏫'
    }
  }

  return (
    <div className="project-card">
      <div className="project-header">
        <div className="project-title-section">
          <h3 className="project-title">{project.title}</h3>
          {showStatus && (
            <span className={`status-badge ${STATUS_COLORS[project.status]}`}>
              {STATUS_LABELS[project.status]}
            </span>
          )}
        </div>
        <div className="project-meta">
          <span className="project-category">
            {getCategoryIcon(project.category)} {project.category}
          </span>
          <span className="project-branch">
            {getDepartmentIcon(project.branch)} {project.branch}
          </span>
        </div>
      </div>

      <div className="project-body">
        <p className="project-overview">{project.shortOverview}</p>
        
        <div className="project-details">
          <div className="project-guide">
            <strong>Faculty Guide:</strong> 
            {project.facultyGuide ? 
              ` ${project.facultyGuide.firstName} ${project.facultyGuide.lastName}` : 
              ' Not assigned'
            }
          </div>
          <div className="project-submitted">
            <strong>Submitted By:</strong> 
            {project.submittedBy ? 
              ` ${project.submittedBy.firstName} ${project.submittedBy.lastName} (${project.submittedBy.collegeId})` : 
              ' Unknown'
            }
          </div>
          {project.teamMembers && project.teamMembers.length > 0 && (
            <div className="project-team">
              <strong>Team Members:</strong> {project.teamMembers.length}
            </div>
          )}
        </div>

        {project.finalDocuments?.report && (
          <div className="project-files">
            <strong>Available Files:</strong>
            <div className="file-badges">
              {project.finalDocuments.report && <span className="file-badge">📄 Report</span>}
              {project.finalDocuments.presentation && <span className="file-badge">📊 PPT</span>}
              {project.finalDocuments.code && <span className="file-badge">💾 Code</span>}
            </div>
          </div>
        )}
      </div>

      <div className="project-footer">
        <Link 
          to={showActions ? `/faculty/projects/${project._id}` : `/projects/${project._id}`} 
          className="btn btn-secondary btn-sm"
        >
          🔍 View Details
        </Link>
        
        {showActions && project.status === 'pending' && (
          <div className="project-actions">
            <button 
              onClick={() => onStatusUpdate(project._id, 'approved')}
              className="btn btn-success btn-sm"
            >
              ✅ Approve
            </button>
            <button 
              onClick={() => onStatusUpdate(project._id, 'rejected')}
              className="btn btn-error btn-sm"
            >
              ❌ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectCard