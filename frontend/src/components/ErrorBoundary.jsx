import { Component } from 'react'

// Class component required — React Error Boundaries cannot be written as functions
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Replace with Sentry or similar in production
    console.error('[ErrorBoundary]', error, info?.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 text-center">
        <div className="max-w-md">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>

          <h1 className="font-playfair text-3xl text-dark-text mb-3">
            Something went wrong
          </h1>
          <p className="font-inter text-dark-text/60 leading-relaxed mb-8">
            We hit an unexpected error. Refreshing usually fixes it — if the problem
            persists, reach us on WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-white font-inter px-7 py-3 rounded-md transition-colors duration-200"
            >
              Refresh Page
            </button>
            <a
              href="/"
              className="w-full sm:w-auto border border-dark-text/20 hover:border-gold text-dark-text hover:text-gold font-inter px-7 py-3 rounded-md transition-colors duration-200 text-center"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    )
  }
}
