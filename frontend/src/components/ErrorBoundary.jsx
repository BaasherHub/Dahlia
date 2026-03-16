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
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        background: '#fefdfb',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#a89968',
          marginBottom: '20px',
        }}>
          Error
        </p>

        <h1 style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 400,
          color: '#0f0d0a',
          margin: '0 0 20px',
          lineHeight: 1.2,
        }}>
          Something went wrong
        </h1>

        <p style={{
          fontSize: '15px',
          color: '#6b6259',
          maxWidth: '480px',
          lineHeight: 1.7,
          margin: '0 0 40px',
        }}>
          We encountered an unexpected error. Please try again or return to the home page.
        </p>

        {this.state.error && (
          <details style={{
            marginBottom: '40px',
            maxWidth: '560px',
            width: '100%',
            textAlign: 'left',
            padding: '16px 20px',
            background: 'rgba(168, 153, 104, 0.06)',
            border: '1px solid rgba(168, 153, 104, 0.2)',
            borderRadius: '8px',
          }}>
            <summary style={{
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#0f0d0a',
              userSelect: 'none',
            }}>
              Error details
            </summary>
            <pre style={{
              marginTop: '12px',
              fontSize: '11px',
              lineHeight: 1.6,
              color: '#6b6259',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {this.state.error.toString()}
            </pre>
          </details>
        )}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={this.resetError}
            style={{
              padding: '13px 32px',
              background: '#a89968',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'background 0.2s ease',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#8b7c54'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#a89968'; }}
          >
            Try Again
          </button>

          <button
            onClick={() => { window.location.href = '/'; }}
            style={{
              padding: '13px 32px',
              background: 'transparent',
              color: '#0f0d0a',
              border: '1px solid rgba(15, 13, 10, 0.25)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'border-color 0.2s ease, background 0.2s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = '#0f0d0a';
              e.currentTarget.style.background = 'rgba(15, 13, 10, 0.04)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'rgba(15, 13, 10, 0.25)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
}
