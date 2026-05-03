import { useState, useEffect } from 'react'
import UploadSection from './components/UploadSection'
import ScoreDisplay from './components/ScoreDisplay'
import FeedbackDisplay from './components/FeedbackDisplay'
import HistoryList from './components/HistoryList'
import LoginPage from './components/LoginPage'
import ResumeTips from './components/ResumeTips'
import TemplateGallery from './components/TemplateGallery'
import HowItWorks from './components/HowItWorks'
import { analyzeResume, getHistory, getMe, logout, setUnauthorizedHandler, getStats } from './services/api'
import { darkTokens as C, C as _C } from './theme'
import { FREE_ANALYSIS_LIMIT } from './constants'

/** Strips HTML tags from backend error strings and returns a clean message. */
function extractErrorMessage(err) {
  const raw = err.response?.data?.error || err.message || 'An error occurred. Please try again.'
  return String(raw).replace(/<[^>]*>/g, '')
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [username, setUsername]               = useState('')
  const [view, setView]                       = useState('upload')
  const [loading, setLoading]                 = useState(false)
  const [historyLoading, setHistoryLoading]   = useState(false)
  const [analysis, setAnalysis]               = useState(null)
  const [prevScore, setPrevScore]             = useState(null)   // Rec #7 before/after
  const [history, setHistory]                 = useState([])
  const [historyPage, setHistoryPage]         = useState(0)
  const [historyHasMore, setHistoryHasMore]   = useState(false)
  const [error, setError]                     = useState('')
  const [showLoginModal, setShowLoginModal]   = useState(false)
  const [loginMessage, setLoginMessage]       = useState('')
  const [totalAnalyses, setTotalAnalyses]     = useState(null)   // Rec #3 social proof

  useEffect(() => {
    setUnauthorizedHandler(() => setIsAuthenticated(false))
    const params = new URLSearchParams(window.location.search)
    if (params.get('auth') === 'success') {
      window.history.replaceState({}, '', '/')
    }
    checkAuth()
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await getStats()
      setTotalAnalyses(data.totalAnalyses)
    } catch { /* non-critical */ }
  }

  const checkAuth = async () => {
    try {
      const data = await getMe()
      setUsername(data.username)
      setIsAuthenticated(true)
      fetchHistory(0)
    } catch {
      setIsAuthenticated(false)
    }
  }

  const handleLogin = (name) => {
    setUsername(name)
    setIsAuthenticated(true)
    setShowLoginModal(false)
    setLoginMessage('')
    fetchHistory(0)
  }

  const handleLogout = async () => {
    try { await logout() } catch { /* ignore */ }
    setIsAuthenticated(false)
    setUsername('')
    setHistory([])
    setAnalysis(null)
    setPrevScore(null)
    setView('upload')
    setError('')
  }

  const openLogin = (msg = '') => {
    setLoginMessage(msg)
    setShowLoginModal(true)
  }

  const fetchHistory = async (page = 0) => {
    setHistoryLoading(true)
    try {
      const data = await getHistory(page)
      setHistory(prev => page === 0 ? data.content : [...prev, ...data.content])
      setHistoryPage(data.page)
      setHistoryHasMore(!data.last)
    } catch (err) {
      console.warn('Failed to load history:', err.message)
    } finally {
      setHistoryLoading(false)
    }
  }

  // Rec #7 — capture last score before new analysis so we can show the delta
  const handleAnalyze = async (file, jobDescription, industry) => {
    setLoading(true)
    setError('')
    const lastScore = analysis?.score ?? (history.length > 0 ? history[0].score : null)
    try {
      const result = await analyzeResume(file, jobDescription, industry)
      setPrevScore(lastScore)
      setAnalysis(result)
      setView('result')
      setTotalAnalyses(n => (n != null ? n + 1 : null))
      if (isAuthenticated) fetchHistory(0)
    } catch (err) {
      if (err.response?.data?.loginRequired) {
        openLogin('You\'ve used your free analysis. Sign in for unlimited access.')
        return
      }
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSelectHistory = (item) => {
    setPrevScore(null)
    setAnalysis(item)
    setView('result')
  }
  const handleNewAnalysis = () => { setAnalysis(null); setPrevScore(null); setError(''); setView('upload') }

  const proofNumber = totalAnalyses != null ? totalAnalyses.toLocaleString() : null

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <header style={styles.header} className="app-header">
        <div style={styles.logo}>
          <div style={styles.logoMark}>R</div>
          <span style={styles.logoText}>AI Resume Analyzer</span>
        </div>
        <nav className="app-nav">
          <button onClick={() => setView('upload')}
            style={{ ...styles.navBtn, ...(view === 'upload' ? styles.navBtnActive : {}) }}>
            Analyze
          </button>
          <button onClick={() => setView('templates')}
            style={{ ...styles.navBtn, ...(view === 'templates' ? styles.navBtnActive : {}) }}>
            Templates
          </button>
          {isAuthenticated && (
            <button onClick={() => { setView('history'); fetchHistory(0) }}
              style={{ ...styles.navBtn, ...(view === 'history' ? styles.navBtnActive : {}) }}>
              History {history.length > 0 && <span style={styles.badge}>{history.length}</span>}
            </button>
          )}
          {isAuthenticated ? (
            <>
              <span style={styles.userChip} className="user-chip-text">{username}</span>
              <button onClick={handleLogout} style={styles.signOutBtn}>Sign Out</button>
            </>
          ) : (
            <button onClick={() => openLogin()} style={styles.signInBtn}>Sign In</button>
          )}
        </nav>
      </header>

      {/* ── Main ── */}
      <main className="app-main">

        {/* Upload View */}
        {view === 'upload' && (
          <div style={styles.uploadView}>

            {/* Hero */}
            <div style={styles.hero}>
              <div style={styles.heroBadge}>AI-Powered Resume Analysis</div>
              <h1 style={styles.heroTitle} className="hero-title">
                Land the Interview.
              </h1>
              <p style={styles.heroSub}>
                Your resume gets <strong style={{ color: C.accent }}>6 seconds</strong> of attention.
                Get an honest AI score and know exactly what to fix before you apply.
              </p>

              {/* Social proof counter — Rec #3 */}
              {proofNumber && (
                <div style={styles.proofRow}>
                  <span style={styles.proofDot} />
                  <span style={styles.proofText}>
                    <strong style={{ color: '#f1f5f9' }}>{proofNumber}</strong> resumes analyzed
                  </span>
                </div>
              )}

              {!isAuthenticated && (
                <p style={styles.freeNote}>{FREE_ANALYSIS_LIMIT} free analyses — no account needed</p>
              )}
            </div>

            {/* How It Works — Rec #4 */}
            <HowItWorks />

            <UploadSection onAnalyze={handleAnalyze} loading={loading} />

            {error && <div style={styles.errorBox}>{error}</div>}

            {loading && (
              <div style={styles.loadingBox}>
                <div style={styles.loadingDots}>
                  <span style={styles.dot} />
                  <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
                  <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
                </div>
                <p style={{ color: C.textSub, fontSize: '15px' }}>AI is reviewing your resume…</p>
                <p style={{ color: C.textMuted, fontSize: '13px' }}>Usually 10–20 seconds. First request may take up to 1 minute (server wake-up).</p>
              </div>
            )}

            <ResumeTips />
          </div>
        )}

        {/* Result View */}
        {view === 'result' && analysis && (
          <div style={styles.resultView}>
            <div style={styles.resultToolbar}>
              <button onClick={handleNewAnalysis} style={styles.backBtn}>← New Analysis</button>
              <h2 style={styles.resultTitle}>Analysis Results</h2>
            </div>

            {/* Before / After score delta — Rec #7 */}
            {prevScore != null && prevScore !== analysis.score && (
              <div style={styles.deltaBanner}>
                <span style={{ ...styles.deltaIcon, color: analysis.score > prevScore ? '#22c55e' : '#f87171' }}>
                  {analysis.score > prevScore ? '↑' : '↓'}
                </span>
                <span style={{ color: '#c7d2fe', fontSize: '14px' }}>
                  Score changed from <strong>{prevScore}</strong> to{' '}
                  <strong>{analysis.score}</strong>
                  {' '}({analysis.score > prevScore ? '+' : ''}{analysis.score - prevScore} points
                  {analysis.score > prevScore ? ' — great progress!' : ' — keep improving'})
                </span>
              </div>
            )}

            {!isAuthenticated && (
              <div style={styles.nudgeBanner}>
                <span>Sign in to save your history and get unlimited analyses</span>
                <button onClick={() => openLogin()} style={styles.nudgeBtn}>Sign In Free</button>
              </div>
            )}

            <div className="result-grid">
              <ScoreDisplay score={analysis.score} analysis={analysis} />
              <FeedbackDisplay analysis={analysis} />
            </div>
          </div>
        )}

        {/* Templates View */}
        {view === 'templates' && <TemplateGallery />}

        {/* History View */}
        {view === 'history' && (
          <div style={styles.historyView}>
            <h2 style={styles.sectionTitle}>Past Analyses</h2>
            {historyLoading && history.length === 0
              ? <p style={{ color: C.textMuted, fontSize: '14px' }}>Loading…</p>
              : <HistoryList
                  history={history}
                  onSelect={handleSelectHistory}
                  hasMore={historyHasMore}
                  onLoadMore={() => fetchHistory(historyPage + 1)}
                  loading={historyLoading}
                />
            }
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        <p>Built with Spring Boot · React · Groq AI · PostgreSQL</p>
      </footer>

      {/* ── Login Modal ── */}
      {showLoginModal && (
        <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowLoginModal(false)}>
          <LoginPage onLogin={handleLogin} onClose={() => setShowLoginModal(false)} message={loginMessage} />
        </div>
      )}
    </div>
  )
}

const styles = {
  page:          { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: `radial-gradient(ellipse 75% 55% at 0% 100%, rgba(99,102,241,0.18) 0%, transparent 55%), radial-gradient(ellipse 55% 45% at 100% 0%, rgba(139,92,246,0.14) 0%, transparent 55%), radial-gradient(ellipse 40% 35% at 50% 45%, rgba(59,130,246,0.06) 0%, transparent 55%), #060d1a` },
  header:        { borderBottom: `1px solid ${C.border}`, background: 'rgba(6,13,26,0.90)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 },
  logo:          { display: 'flex', alignItems: 'center', gap: '10px' },
  logoMark:      { width: '32px', height: '32px', borderRadius: '8px', background: C.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', color: '#fff' },
  logoText:      { fontSize: '17px', fontWeight: '700', color: C.text, letterSpacing: '-0.3px' },
  navBtn:        { padding: '7px 16px', borderRadius: '8px', border: '1px solid transparent', background: 'transparent', color: C.textMuted, cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' },
  navBtnActive:  { background: '#0d1629', color: C.text, border: `1px solid ${C.border}` },
  badge:         { background: C.accent, color: '#fff', borderRadius: '999px', padding: '1px 7px', fontSize: '11px', fontWeight: '700' },
  userChip:      { color: C.textSub, fontSize: '13px', padding: '6px 12px', background: '#0d1629', border: `1px solid ${C.border}`, borderRadius: '999px' },
  signOutBtn:    { padding: '7px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, background: 'transparent', color: C.textMuted, cursor: 'pointer', fontSize: '13px' },
  signInBtn:     { padding: '7px 18px', borderRadius: '8px', border: 'none', background: C.gradient, color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '700' },

  uploadView:    { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' },
  hero:          { textAlign: 'center', maxWidth: '600px' },
  heroBadge:     { display: 'inline-block', background: '#0d1629', border: `1px solid ${C.border}`, color: C.accent, padding: '4px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '18px' },
  heroTitle:     { fontWeight: '800', color: C.text },
  heroSub:       { color: C.textSub, fontSize: '17px', lineHeight: '1.7', marginBottom: '14px' },

  proofRow:      { display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '999px', padding: '5px 14px', marginBottom: '12px' },
  proofDot:      { width: '7px', height: '7px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 6px #22c55e99' },
  proofText:     { fontSize: '13px', color: C.textMuted },

  freeNote:      { color: C.textMuted, fontSize: '13px', marginTop: '4px' },
  errorBox:      { background: _C.errorSurface, border: `1px solid ${_C.errorBorder}`, color: _C.errorText, padding: '14px 20px', borderRadius: '10px', maxWidth: '500px', textAlign: 'center' },
  loadingBox:    { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  loadingDots:   { display: 'flex', gap: '8px' },
  dot:           { width: '10px', height: '10px', background: C.accent, borderRadius: '50%', animation: 'pulse 1.2s ease-in-out infinite' },

  resultView:    { width: '100%', overflowX: 'hidden', animation: 'fadeIn 0.4s ease' },
  resultToolbar: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
  backBtn:       { background: 'transparent', border: `1px solid ${C.border}`, color: C.textMuted, padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  resultTitle:   { fontSize: '22px', fontWeight: '700', color: C.text },

  deltaBanner:   { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '10px 16px', marginBottom: '16px' },
  deltaIcon:     { fontSize: '22px', fontWeight: '900', lineHeight: 1 },

  nudgeBanner:   { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: 'linear-gradient(145deg, #eef2ff, #e0e7ff)', border: '1px solid #c7d2fe', borderLeft: `3px solid ${C.accent}`, borderRadius: '10px', padding: '12px 18px', marginBottom: '20px', color: '#1e40af', fontSize: '14px' },
  nudgeBtn:      { background: C.gradient, border: 'none', color: '#fff', padding: '6px 16px', borderRadius: '7px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' },

  historyView:   { width: '100%', maxWidth: '700px', margin: '0 auto' },
  sectionTitle:  { fontSize: '22px', fontWeight: '700', color: C.text, marginBottom: '20px', fontStyle: 'italic' },
  footer:        { textAlign: 'center', padding: '20px', borderTop: `1px solid ${C.border}`, color: C.textMuted, fontSize: '13px' },
  modalOverlay:  { position: 'fixed', inset: 0, background: 'rgba(6,13,26,0.88)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' },
}
