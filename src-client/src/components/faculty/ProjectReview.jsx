import { useState } from 'react'
import toast from 'react-hot-toast'

const ProjectReview = ({ project, onStatusUpdate, onClose }) => {
  const [remarks, setRemarks] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const handleStatusUpdate = async (status) => {
    if (status === 'rejected' && !remarks.trim()) {
      toast.error('Please provide remarks for rejection')
      return
    }

    setActionLoading(true)
    try {
      await onStatusUpdate(project._id, status, remarks)
      toast.success(`Project ${status === 'approved' ? 'approved' : 'rejected'} successfully!`)
      if (onClose) onClose()
    } catch (error) {
      toast.error('Failed to update project status')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="project-review">
      <div className="review-header">
        <h3>Review Project: {project.title}</h3>
        <button onClick={onClose} className="btn btn-secondary btn-sm">✕</button>
      </div>

      <div className="review-content">
        <div className="project-details">
          <div className="detail-group">
            <label>Category:</label>
            <span>{project.category}</span>
          </div>
          <div className="detail-group">
            <label>Branch:</label>
            <span>{project.branch}</span>
          </div>
          <div className="detail-group">
            <label>Submitted By:</label>
            <span>{project.submittedBy?.firstName} {project.submittedBy?.lastName}</span>
          </div>
          <div className="detail-group">
            <label>Overview:</label>
            <p>{project.shortOverview}</p>
          </div>
          <div className="detail-group">
            <label>Description:</label>
            <div className="description-content">
              {project.description}
            </div>
          </div>
        </div>

        {project.teamMembers && project.teamMembers.length > 0 && (
          <div className="team-section">
            <h4>Team Members</h4>
            <div className="team-list">
              {project.teamMembers.map((member, index) => (
                <div key={index} className="team-member">
                  <strong>{member.name}</strong>
                  <span>{member.studentId}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="remarks-section">
          <label htmlFor="remarks" className="form-label">
            Remarks {project.status === 'rejected' && '(Required for rejection)'}
          </label>
          <textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="form-textarea"
            placeholder="Provide feedback or reasons for approval/rejection..."
            rows="4"
          />
        </div>
      </div>

      <div className="review-actions">
        <button
          onClick={() => handleStatusUpdate('approved')}
          disabled={actionLoading}
          className="btn btn-success"
        >
          ✅ Approve Project
        </button>
        <button
          onClick={() => handleStatusUpdate('rejected')}
          disabled={actionLoading || !remarks.trim()}
          className="btn btn-error"
        >
          ❌ Reject Project
        </button>
        <button
          onClick={onClose}
          disabled={actionLoading}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default ProjectReview