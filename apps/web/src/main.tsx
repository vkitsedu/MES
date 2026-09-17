import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Cleanroom Cockpit] Uncaught render exception:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '32px', fontFamily: 'monospace', background: '#0D1117', color: '#F85149', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '20px', marginBottom: '16px' }}>Cleanroom Cockpit Runtime Initialization Error</h1>
          <p style={{ color: '#C9D1D9', marginBottom: '12px' }}>A frontend exception occurred during component tree mounting:</p>
          <pre style={{ background: '#161B22', padding: '16px', borderRadius: '8px', border: '1px solid #30363D', whiteSpace: 'pre-wrap', color: '#FF7B72' }}>
            {this.state.error?.stack || this.state.error?.message || 'Unknown error'}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px', padding: '8px 16px', background: '#238636', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Reload Cockpit
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Global script execution error catcher
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const root = document.getElementById('root');
    if (root && (!root.innerHTML || root.innerHTML.trim() === '')) {
      root.innerHTML = `
        <div style="padding: 32px; font-family: monospace; background: #0D1117; color: #F85149; min-height: 100vh;">
          <h1 style="font-size: 20px; margin-bottom: 16px;">Cleanroom Cockpit Script Loading Error</h1>
          <p style="color: #C9D1D9; margin-bottom: 12px;">Uncaught error: ${event.message}</p>
          <pre style="background: #161B22; padding: 16px; border-radius: 8px; border: 1px solid #30363D; color: #FF7B72;">
${event.filename}:${event.lineno}:${event.colno}
          </pre>
        </div>
      `;
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
);
