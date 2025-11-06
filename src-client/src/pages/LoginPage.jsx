import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/common/Footer'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Navbar from '../components/common/Navbar'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  
  const { login, isAuthenticated } = useAuth()
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
    setLoading(true)

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      toast.success('Login successful!')
      // Navigation is handled by AuthContext and useEffect
    } else {
      toast.error(result.message)
    }
    
    setLoading(false)
  }

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      student: {
        email: 'student@demo.com',
        password: 'demo123'
      },
      faculty: {
        email: 'faculty@demo.com', 
        password: 'demo123'
      }
    }
    
    setFormData(demoAccounts[role])
  }

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your EduProjects account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary auth-btn"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="small" /> : '🔐 Sign In'}
            </button>
          </form>

          <div className="demo-accounts">
            <h3>Demo Accounts</h3>
            <div className="demo-buttons">
              <button 
                onClick={() => handleDemoLogin('student')}
                className="btn btn-secondary btn-sm"
              >
                🎓 Student Demo
              </button>
              <button 
                onClick={() => handleDemoLogin('faculty')}
                className="btn btn-secondary btn-sm"
              >
                👨‍🏫 Faculty Demo
              </button>
            </div>
            <div className="demo-account">
              <strong>Student:</strong> student@demo.com / demo123
            </div>
            <div className="demo-account">
              <strong>Faculty:</strong> faculty@demo.com / demo123
            </div>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default LoginPage