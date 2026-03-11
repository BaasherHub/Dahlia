import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '60px 24px',
          textAlign: 'center',
          backgroundColor: '#fefdfb',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: "'DM Sans', sans-serif"
        }}>
          <h1 style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: '48px',
            marginBottom: '16px',
            color: '#0f0d0a'
          }}>
            Something Went Wrong
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#4a4540',
            maxWidth: '600px',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            We encountered an error while loading the page.
            Please try refreshing or going back to the home page.
          </p>
          {this.state.error && (
            <details style={{
              marginBottom: '32px',
              maxWidth: '600px',
              textAlign: 'left',
              padding: '16px',
              backgroundColor: '#f3ede5',
              borderRadius: '8px',
              borderLeft: '4px solid #a89968'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#0f0d0a' }}>
                Error Details
              </summary>
              <pre style={{
                marginTop: '12px',
                fontSize: '12px',
                overflow: 'auto',
                color: '#4a4540'
              }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.resetError}
              style={{
                padding: '14px 32px',
                backgroundColor: '#a89968',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#8b7355'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#a89968'}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '14px 32px',
                backgroundColor: 'transparent',
                color: '#0f0d0a',
                border: '1.5px solid #0f0d0a',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#0f0d0a';
                e.target.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#0f0d0a';
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    try {
      return this.props.children;
    } catch (error) {
      this.setState({ hasError: true, error });
      return null;
    }
  }
}
