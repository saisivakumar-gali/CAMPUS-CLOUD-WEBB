import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const scrollToSection = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate('/')
      // Scroll after navigation
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
    setIsMenuOpen(false)
  }

  const PublicNavbar = () => (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <span className="logo-icon"><i class="ri-school-fill"></i></span>
            Campus Cloud Web
          </Link>
          
          <div className="nav-links">
            <button 
              onClick={() => scrollToSection('home')} 
              className="nav-link"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="nav-link"
            >
              About
            </button>
            
            <button 
              onClick={() => scrollToSection('contact')} 
              className="nav-link"
            >
              Contact
            </button>
            <Link to="/login" className="nav-link btn-outline">
              Login
            </Link>
            <Link to="/register" className="nav-link btn-primary reg">
              Register
            </Link>
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <button onClick={() => scrollToSection('home')} className="mobile-nav-link">Home</button>
            <button onClick={() => scrollToSection('about')} className="mobile-nav-link">About</button>
            <button onClick={() => scrollToSection('gallery')} className="mobile-nav-link">Gallery</button>
            <button onClick={() => scrollToSection('contact')} className="mobile-nav-link">Contact</button>
            <Link to="/login" className="mobile-nav-link">Login</Link>
            <Link to="/register" className="mobile-nav-link">Register</Link>
          </div>
        )}
      </div>
    </nav>
  )

  const DashboardNavbar = () => (
    <nav className="navbar dashboard-nav">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <span className="logo-icon"></span>
            CAMPUS CLOUD WEB
          </Link>
          
          <div className="nav-links">
            <Link 
              to={user?.role === 'student' ? '/student/dashboard' : '/faculty/dashboard'} 
              className="nav-link"
            >
              Home
            </Link>
            <Link to="/projects" className="nav-link">
              All Projects
            </Link>
            {user?.role === 'student' && (
              <Link to="/student/dashboard#upload" className="nav-link">
                Upload
              </Link>
            )}
            <div className="user-menu">
              <span className="user-greeting">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <button onClick={handleLogout} className="nav-link btn-outline logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )

  return isAuthenticated ? <DashboardNavbar /> : <PublicNavbar />
}

export default Navbar