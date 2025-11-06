import { Link } from 'react-router-dom'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <Navbar />
      
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-icon">🔍</div>
          <h1>404 - Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              🏠 Go Home
            </Link>
            <Link to="/projects" className="btn btn-secondary">
              📁 Browse Projects
            </Link>
            <button onClick={() => window.history.back()} className="btn btn-secondary">
              ↩️ Go Back
            </button>
          </div>

          <div className="not-found-suggestions">
            <h3>You might be looking for:</h3>
            <ul>
              <li><Link to="/">Home Page</Link></li>
              <li><Link to="/projects">All Projects</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/student/dashboard">Student Dashboard</Link></li>
              <li><Link to="/faculty/dashboard">Faculty Dashboard</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default NotFoundPage