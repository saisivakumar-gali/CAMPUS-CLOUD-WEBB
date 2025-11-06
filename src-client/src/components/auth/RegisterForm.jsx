
const RegisterForm = ({ formData, handleChange, agreeTerms, setAgreeTerms }) => {
  return (
    <div className="auth-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="form-input"
            placeholder="Enter first name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="form-input"
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="collegeId" className="form-label">
          College ID
        </label>
        <input
          type="text"
          id="collegeId"
          name="collegeId"
          value={formData.collegeId}
          onChange={(e) => handleChange('collegeId', e.target.value)}
          className="form-input"
          placeholder="Enter your college ID"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="form-input"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Role</label>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="role"
              value="student"
              checked={formData.role === 'student'}
              onChange={(e) => handleChange('role', e.target.value)}
            />
            <span className="radio-label">🎓 Student</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="role"
              value="faculty"
              checked={formData.role === 'faculty'}
              onChange={(e) => handleChange('role', e.target.value)}
            />
            <span className="radio-label">👨‍🏫 Faculty</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="department" className="form-label">
          Department
        </label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={(e) => handleChange('department', e.target.value)}
          className="form-select"
          required
        >
          <option value="">Select Department</option>
          <option value="CSE">Computer Science (CSE)</option>
          <option value="ECE">Electronics (ECE)</option>
          <option value="EEE">Electrical (EEE)</option>
          <option value="MECH">Mechanical (MECH)</option>
          <option value="CIVIL">Civil (CIVIL)</option>
          <option value="BUSINESS">Business</option>
          <option value="SCIENCE">Science</option>
          <option value="ARTS">Arts & Design</option>
        </select>
      </div>

      {formData.role === 'faculty' && (
        <div className="form-group">
          <label htmlFor="designation" className="form-label">
            Designation
          </label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={(e) => handleChange('designation', e.target.value)}
            className="form-input"
            placeholder="e.g., Professor, Assistant Professor"
            required
          />
        </div>
      )}

      {formData.role === 'student' && (
        <div className="form-group">
          <label htmlFor="year" className="form-label">
            Academic Year
          </label>
          <select
            id="year"
            name="year"
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Final Year">Final Year</option>
          </select>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="form-input"
            placeholder="Enter password"
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            className="form-input"
            placeholder="Confirm password"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            required
          />
          <span>I agree to the Terms & Conditions</span>
        </label>
      </div>
    </div>
  )
}

export default RegisterForm