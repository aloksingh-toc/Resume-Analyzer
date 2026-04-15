import { useState, useEffect } from 'react'
import UploadSection from './components/UploadSection'
import ScoreDisplay from './components/ScoreDisplay'
import FeedbackDisplay from './components/FeedbackDisplay'
import HistoryList from './components/HistoryList'
import { analyzeResume, getHistory } from './services/api'

export default function App() {
  const [view, setView] = useState('upload')       // 'upload' | 'result' | 'history'
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const data = await getHistory()
      setHistory(data)
    } catch {
      // silently fail — history is non-critical
    }
  }

  const handleAnalyze = async (file) => {
    setLoading(true)
    setError('')
    try {
      const result = await analyzeResume(file)
      setAnalysis(result)
      setView('result')
      fetchHistory()
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'An error occurred. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectHistory = (item) => {
    setAnalysis(item)
    setView('result')
  }

  const handleNewAnalysis = () => {
    setAnalysis(null)
    setError('')
    setView('upload')
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🤖</span>
          <span style={styles.logoText}>AI Resume Analyzer</span>
        </div>
        <nav style={styles.nav}>
          <button
            onClick={() => setView('upload')}
            style={{ ...styles.navBtn, ...(view === 'upload' ? styles.navBtnActive : {}) }}
          >
            Analyze
          </button>
          <button
            onClick={() => setView('history')}
            style={{ ...styles.navBtn, ...(view === 'history' ? styles.navBtnActive : {}) }}
          >
            History {history.length > 0 && <span style={styles.badge}>{history.length}</span>}
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Upload View */}
        {view === 'upload' && (
          <div style={styles.uploadView}>
            <div style={styles.hero}>
              <h1 style={styles.heroTitle}>
                Get Your Resume <span style={styles.highlight}>AI-Scored</span>
              </h1>
              <p style={styles.heroSub}>
                Upload your PDF resume and receive an instant quality score with detailed,
                actionable feedback powered by OpenAI.
              </p>
            </div>
            <UploadSection onAnalyze={handleAnalyze} loading={loading} />
            {error && (
              <div style={styles.errorBox}>
                <span>⚠️</span> {error}
              </div>
            )}
            {loading && (
              <div style={styles.loadingBox}>
                <div style={styles.loadingDots}>
                  <span />
                  <span />
                  <span />
                </div>
                <p>AI is reading and scoring your resume...</p>
                <p style={{ fontSize: '13px', color: '#475569' }}>This may take 10–20 seconds</p>
              </div>
            )}
          </div>
        )}

        {/* Result View */}
        {view === 'result' && analysis && (
          <div style={styles.resultView}>
            <div style={styles.resultToolbar}>
              <button onClick={handleNewAnalysis} style={styles.backBtn}>
                ← New Analysis
              </button>
              <h2 style={styles.resultTitle}>Analysis Results</h2>
            </div>
            <div style={styles.resultGrid}>
              <ScoreDisplay score={analysis.score} analysis={analysis} />
              <FeedbackDisplay analysis={analysis} />
            </div>
          </div>
        )}

        {/* History View */}
        {view === 'history' && (
          <div style={styles.historyView}>
            <h2 style={styles.sectionTitle}>Past Analyses</h2>
            <HistoryList history={history} onSelect={handleSelectHistory} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>Built with ☕ Java · Spring Boot · React · OpenAI API · MySQL</p>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        div[class*='dot'] > span {
          display: inline-block;
          width: 8px; height: 8px;
          background: #6366f1;
          border-radius: 50%;
          animation: pulse 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#0f172a',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    borderBottom: '1px solid #1e293b',
    background: '#0f172a',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    fontSize: '26px',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: '-0.3px',
  },
  nav: {
    display: 'flex',
    gap: '8px',
  },
  navBtn: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: '1px solid transparent',
    background: 'transparent',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  navBtnActive: {
    background: '#1e293b',
    color: '#f1f5f9',
    border: '1px solid #334155',
  },
  badge: {
    background: '#6366f1',
    color: '#fff',
    borderRadius: '999px',
    padding: '1px 7px',
    fontSize: '11px',
    fontWeight: '700',
  },
  main: {
    flex: 1,
    padding: '40px 24px',
    maxWidth: '1100px',
    margin: '0 auto',
    width: '100%',
  },
  uploadView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '28px',
  },
  hero: {
    textAlign: 'center',
    maxWidth: '560px',
  },
  heroTitle: {
    fontSize: '38px',
    fontWeight: '800',
    color: '#f1f5f9',
    lineHeight: '1.2',
    marginBottom: '12px',
  },
  highlight: {
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSub: {
    color: '#94a3b8',
    fontSize: '16px',
    lineHeight: '1.6',
  },
  errorBox: {
    background: '#7f1d1d',
    border: '1px solid #ef4444',
    color: '#fca5a5',
    padding: '14px 20px',
    borderRadius: '10px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    maxWidth: '500px',
  },
  loadingBox: {
    textAlign: 'center',
    color: '#94a3b8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  loadingDots: {
    display: 'flex',
    gap: '6px',
  },
  resultView: {
    width: '100%',
  },
  resultToolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  backBtn: {
    background: 'transparent',
    border: '1px solid #334155',
    color: '#94a3b8',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  resultTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#f1f5f9',
  },
  resultGrid: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '20px',
    alignItems: 'start',
  },
  historyView: {
    width: '100%',
    maxWidth: '700px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '20px',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    borderTop: '1px solid #1e293b',
    color: '#475569',
    fontSize: '13px',
  },
}
