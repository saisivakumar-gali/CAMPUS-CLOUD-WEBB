import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "./styles/navbar-overrides.css";
import "./styles/landing-page-overrides.css";
import "./styles/auth-page-overrides.css";
import "./styles/dashboard-page-overrides.css";
import "./styles/faculty-dashboard-overrides.css";
import "./styles/pending-projects-overrides.css";
import "./styles/project-card-overrides.css";
import "./styles/projects-section-overrides.css";
import "./styles/project-detail-page-overrides.css";
import "./styles/Student-dashboard-overrides.css";



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)