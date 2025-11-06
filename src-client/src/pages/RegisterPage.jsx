import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'
import Footer from '../components/common/Footer'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Navbar from '../components/common/Navbar'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    collegeId: '',
    email: '',
    role: 'student',
    department: '',
    designation: '',
    year: '',
    password: '',
    confirmPassword: ''
  })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/student/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!agreeTerms) {
      toast.error('Please agree to the Terms & Conditions')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    // Prepare data for API
    const submitData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      collegeId: formData.collegeId,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      password: formData.password
    }

    // Add role-specific fields
    if (formData.role === 'faculty') {
      submitData.designation = formData.designation
    } else {
      submitData.year = formData.year
    }

    const result = await register(submitData)
    
    if (result.success) {
      toast.success('Registration successful!')
      // Navigation is handled by AuthContext and useEffect
    } else {
      // IMPROVED ERROR DISPLAY
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach(error => toast.error(error.msg))
      } else {
        toast.error(result.message)
      }
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join EduProjects today</p>
          </div>

          <form onSubmit={handleSubmit}>
            <RegisterForm 
              formData={formData}
              handleChange={handleChange}
              agreeTerms={agreeTerms}
              setAgreeTerms={setAgreeTerms}
            />

            <button 
              type="submit" 
              className="btn btn-primary auth-btn"
              disabled={loading || !agreeTerms}
            >
              {loading ? <LoadingSpinner size="small" /> : '🚀 Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default RegisterPage