import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🏫</span>
              EDUPROJECTS
            </div>
            <p className="footer-description">
              Empowering students and faculty with a comprehensive project management platform for academic excellence and innovation.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">💼</a>
              <a href="#" className="social-link">📷</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/projects" className="footer-link">Browse Projects</Link>
              <Link to="/login" className="footer-link">Student Login</Link>
              <Link to="/login" className="footer-link">Faculty Login</Link>
            </div>
          </div>

          <div className="footer-section">
            <h4>Departments</h4>
            <div className="footer-links">
              <span className="footer-link">Computer Science</span>
              <span className="footer-link">Electronics</span>
              <span className="footer-link">Electrical</span>
              <span className="footer-link">Mechanical</span>
              <span className="footer-link">Civil</span>
              <span className="footer-link">Business</span>
            </div>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>contact@eduprojects.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>University Campus, City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 EduProjects. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            <Link to="/terms" className="footer-link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer