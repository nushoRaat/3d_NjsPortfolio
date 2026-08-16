import React, { Component } from 'react';
import PortfolioApp from './components/PortfolioApp';

class ErrorBoundary extends Component {
  state = { crashed: false, message: '' };
  static getDerivedStateFromError(error) {
    return { crashed: true, message: error?.message || String(error) };
  }
  render() {
    if (this.state.crashed) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#0f172a',
            color: '#c8d0ff',
            fontFamily: "'Fira Mono', monospace",
            flexDirection: 'column',
            gap: '1rem',
            padding: '2rem',
          }}
        >
          <span style={{ fontSize: '2rem' }}>⚠</span>
          <p style={{ margin: 0 }}>Something went wrong while loading the game.</p>
          <p
            style={{
              margin: 0,
              fontSize: '0.75rem',
              color: 'rgba(200,210,255,0.5)',
              maxWidth: '600px',
              textAlign: 'center',
            }}
          >
            {this.state.message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <PortfolioApp />
    </ErrorBoundary>
  );
}
