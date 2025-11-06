import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h1>😵 Something went wrong</h1>
            <p>We're sorry, but something unexpected happened.</p>
            <div className="error-actions">
              <button 
                onClick={() => window.location.href = '/'}
                className="btn btn-primary"
              >
                Go Home
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-secondary"
              >
                Reload Page
              </button>
            </div>
            <details className="error-details">
              <summary>Technical Details</summary>
              <pre>{this.state.error?.toString()}</pre>
            </details>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary