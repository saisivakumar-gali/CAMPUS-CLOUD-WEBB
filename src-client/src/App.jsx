import { Toaster } from 'react-hot-toast'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Pages
import AllProjectsPage from './pages/AllProjectsPage'
import FacultyDashboardPage from './pages/FacultyDashboardPage'
import FacultyProjectDetailPage from './pages/FacultyProjectDetailPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboardPage from './pages/StudentDashboardPage'

// Components
import ErrorBoundary from './components/common/ErrorBoundary'
import ProtectedRoute from './components/common/ProtectedRoute'

import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/projects" element={<AllProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />

              {/* Protected Student Routes */}
              <Route 
                path="/student/dashboard" 
                element={
                  <ProtectedRoute role="student">
                    <StudentDashboardPage />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Faculty Routes */}
              <Route 
                path="/faculty/dashboard" 
                element={
                  <ProtectedRoute role="faculty">
                    <FacultyDashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/faculty/projects/:id" 
                element={
                  <ProtectedRoute role="faculty">
                    <FacultyProjectDetailPage />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Page */}
              <Route path="/404" element={<NotFoundPage />} />
              
              {/* Redirect to home for unknown routes */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App