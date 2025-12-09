import { Link } from 'react-router-dom';
import { STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';

// ADD these helper functions at the top (after imports)
const getDomainIcon = (domain) => {
  const domainIcons = {
    'IoT': '📶',
    'Machine Learning': '🤖',
    'Web Development': '🌐',
    'Mobile Development': '📱',
    'Embedded Systems': '⚙️',
    'Cloud Computing': '☁️',
    'DevOps': '🔄',
    'Data Science': '📊',
    'Cybersecurity': '🔒',
    'Networking': '📡',
    'Robotics': '🤖',
    'Computer Vision': '👁️',
    'Natural Language Processing': '💬',
    'Blockchain': '⛓️',
    'AR/VR': '👓'
  };
  
  for (const [key, icon] of Object.entries(domainIcons)) {
    if (domain?.includes(key)) return icon;
  }
  return '💼';
};

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

// UPDATE the ProjectCard component body
const ProjectCard = ({ project, showStatus = false, showActions = false, onStatusUpdate }) => {
  const hasFinalSubmission = project.finalDocuments || project.finalDetails;
  const submissionType = project.finalDetails ? 'form' : project.finalDocuments ? 'files' : null;

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
        
        {/* NEW: Domain display for form-based projects */}
        {project.finalDetails?.basicInfo?.projectDomain && (
          <div className="project-domain">
            <span className="domain-icon">
              {getDomainIcon(project.finalDetails.basicInfo.projectDomain)}
            </span>
            <span className="domain-name">
              {project.finalDetails.basicInfo.projectDomain}
            </span>
          </div>
        )}
        
        <div className="project-meta">
          <span className="project-category">
            {getCategoryIcon(project.category)} {project.category}
          </span>
          <span className="project-branch">
            {getDepartmentIcon(project.branch)} {project.branch}
          </span>
          {project.finalDetails?.basicInfo?.batchYear && (
            <span className="project-batch">
              🎓 {project.finalDetails.basicInfo.batchYear}
            </span>
          )}
        </div>
      </div>

      <div className="project-body">
        {/* Show abstract if available from form, otherwise show short overview */}
        {project.finalDetails?.description?.abstract ? (
          <p className="project-abstract">{project.finalDetails.description.abstract}</p>
        ) : (
          <p className="project-overview">{project.shortOverview}</p>
        )}
        
        <div className="project-details">
          {/* Form-based project details */}
          {project.finalDetails ? (
            <>
              <div className="project-team">
                <strong>Team:</strong> {project.finalDetails.basicInfo.teamMembers?.join(', ')}
              </div>
              <div className="project-guide">
                <strong>Guide:</strong> {project.finalDetails.basicInfo.guideName}
              </div>
              {project.finalDetails.technicalDetails.technologiesUsed?.length > 0 && (
                <div className="project-tech">
                  <strong>Tech:</strong> {project.finalDetails.technicalDetails.technologiesUsed.slice(0, 3).join(', ')}
                  {project.finalDetails.technicalDetails.technologiesUsed.length > 3 && '...'}
                </div>
              )}
            </>
          ) : (
            /* File-based project details (existing) */
            <>
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
                  ` ${project.submittedBy.firstName} ${project.submittedBy.lastName}` : 
                  ' Unknown'
                }
              </div>
              {project.teamMembers && project.teamMembers.length > 0 && (
                <div className="project-team">
                  <strong>Team Members:</strong> {project.teamMembers.length}
                </div>
              )}
            </>
          )}
        </div>

        {/* Project Highlights for form-based projects */}
        {project.finalDetails && (
          <div className="project-highlights">
            <div className="highlight-item">
              <strong>Objectives:</strong>
              <ul>
                {project.finalDetails.description.objectives?.slice(0, 2).map((obj, index) => (
                  <li key={index}>{obj}</li>
                ))}
                {project.finalDetails.description.objectives?.length > 2 && (
                  <li>+{project.finalDetails.description.objectives.length - 2} more</li>
                )}
              </ul>
            </div>
            
            {project.finalDetails.technicalDetails.finalOutput && (
              <div className="highlight-item">
                <strong>Output:</strong> {project.finalDetails.technicalDetails.finalOutput.substring(0, 100)}...
              </div>
            )}
          </div>
        )}

        {/* File badges for file-based projects (existing) */}
        {project.finalDocuments && (
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
        
        {/* Submission type badge */}
        {hasFinalSubmission && (
          <div className="submission-badge">
            {submissionType === 'form' ? '📝 Form' : '📁 Files'}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectCard