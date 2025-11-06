import { DEPARTMENTS, PROJECT_CATEGORIES } from '../../utils/constants'

const ProjectUpload = ({ 
  uploadForm, 
  handleUploadFormChange, 
  handleTeamMemberChange, 
  addTeamMember, 
  removeTeamMember, 
  faculty 
}) => {
  return (
    <div className="upload-form-card">
      <h3 className="section-title">🆕 Upload New Project</h3>
      <p className="form-description">
        Use this section to submit a new project proposal for faculty review. 
        Fill in all required details, select your mentor, and add your team member information.
      </p>

      <form className="project-form">
        <div className="form-group">
          <label className="form-label">Project Title *</label>
          <input
            type="text"
            value={uploadForm.title}
            onChange={(e) => handleUploadFormChange('title', e.target.value)}
            className="form-input"
            placeholder="Enter project title"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              value={uploadForm.category}
              onChange={(e) => handleUploadFormChange('category', e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select Category</option>
              {PROJECT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Branch *</label>
            <select
              value={uploadForm.branch}
              onChange={(e) => handleUploadFormChange('branch', e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select Branch</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Short Overview *</label>
          <input
            type="text"
            value={uploadForm.shortOverview}
            onChange={(e) => handleUploadFormChange('shortOverview', e.target.value)}
            className="form-input"
            placeholder="Brief description of your project (max 200 characters)"
            required
            maxLength="200"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Detailed Description *</label>
          <textarea
            value={uploadForm.description}
            onChange={(e) => handleUploadFormChange('description', e.target.value)}
            className="form-textarea"
            placeholder="Describe your project in detail..."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Select Faculty Mentor *</label>
          <select
            value={uploadForm.facultyGuide}
            onChange={(e) => handleUploadFormChange('facultyGuide', e.target.value)}
            className="form-select"
            required
          >
            <option value="">Choose Faculty Guide</option>
            {faculty.map(prof => (
              <option key={prof._id} value={prof._id}>
                {prof.firstName} {prof.lastName} - {prof.designation} ({prof.department})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Team Members</label>
          {uploadForm.teamMembers.map((member, index) => (
            <div key={index} className="team-member-row">
              <input
                type="text"
                placeholder="Full Name"
                value={member.name}
                onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Student ID"
                value={member.studentId}
                onChange={(e) => handleTeamMemberChange(index, 'studentId', e.target.value)}
                className="form-input"
              />
              {uploadForm.teamMembers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTeamMember(index)}
                  className="btn btn-error btn-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          {uploadForm.teamMembers.length < 4 && (
            <button
              type="button"
              onClick={addTeamMember}
              className="btn btn-secondary btn-sm"
            >
              + Add Team Member
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default ProjectUpload