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
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '60px 24px', 
          textAlign: 'center',
          backgroundColor: '#faf9f7',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1 style={{ 
            fontFamily: "'Lora', serif", 
            fontSize: '48px',
            marginBottom: '16px',
            color: '#1a1815'
          }}>
            Oops!
          </h1>
          <p style={{ 
            fontSize: '16px',
            color: '#7a7469',
            maxWidth: '600px',
            marginBottom: '32px'
          }}>
            Something went wrong. Please refresh the page or try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '14px 32px',
              backgroundColor: '#1a1815',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
