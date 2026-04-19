import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled React error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.page}>
          <h2 style={styles.title}>Something went wrong</h2>
          <p style={styles.sub}>Please refresh the page to try again.</p>
          <button onClick={() => window.location.reload()} style={styles.btn}>
            Refresh
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f172a',
    color: '#f1f5f9',
    gap: '16px',
  },
  title: { fontSize: '20px', fontWeight: '700', margin: 0 },
  sub: { color: '#94a3b8', fontSize: '14px', margin: 0 },
  btn: {
    padding: '8px 20px',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
}
