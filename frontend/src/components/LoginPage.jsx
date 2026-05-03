import { useState } from 'react'
import { login, register } from '../services/api'
import { lightTokens, C as _theme } from '../theme'
import { getOAuthUrl } from '../constants'

const C = { ...lightTokens, bg: _theme.bg, warm: _theme.accentWarm, grad: _theme.gradient }

export default function LoginPage({ onLogin, onClose, message }) {
  const [tab, setTab]                   = useState('signin')
  const [username, setUsername]         = useState('')
  const [password, setPassword]         = useState('')
  const [confirmPassword, setConfirm]   = useState('')
  const [email, setEmail]               = useState('')
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)

  const isModal = !!onClose

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (tab === 'signup') {
      if (password !== confirmPassword) { setError('Passwords do not match'); return }
      if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    }
    setLoading(true)
    try {
      const data = tab === 'signin'
        ? await login(username, password)
        : await register(username, password, email)
      onLogin(data.username)
    } catch (err) {
      setError(err.response?.data?.error || (tab === 'signin' ? 'Invalid credentials.' : 'Registration failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = (provider) => {
    window.location.href = getOAuthUrl(provider)
  }

  const card = (
    <div style={{ ...styles.card, ...(isModal ? styles.cardModal : {}) }}>
      {isModal && (
        <button onClick={onClose} style={styles.closeBtn} aria-label="Close">✕</button>
      )}

      <div style={styles.logoRow}>
        <div style={styles.logoMark}>R</div>
        <span style={styles.logoText}>AI Resume Analyzer</span>
      </div>

      {message && (
        <div style={styles.messageBanner}>
          <span>✦</span> {message}
        </div>
      )}

      <div style={styles.tabs}>
        <button
          onClick={() => setTab('signin')}
          style={{ ...styles.tabBtn, ...(tab === 'signin' ? styles.tabActive : {}) }}
        >Sign In</button>
        <button
          onClick={() => setTab('signup')}
          style={{ ...styles.tabBtn, ...(tab === 'signup' ? styles.tabActive : {}) }}
        >Sign Up</button>
      </div>

      <div style={styles.oauthSection}>
        <button onClick={() => handleOAuth('google')} style={styles.oauthBtn}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>

      {tab === 'signin' && (
        <>
          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or sign in with username</span>
            <span style={styles.dividerLine} />
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={styles.input}
                placeholder="Enter username"
                required
                autoFocus
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Enter password"
                required
              />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, ...(loading ? styles.btnDisabled : {}) }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </>
      )}

      {tab === 'signup' && (
        <>
          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or sign up with username</span>
            <span style={styles.dividerLine} />
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Username <span style={{ color: C.muted }}>(min 3 chars)</span></label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={styles.input}
                placeholder="Choose a username"
                required
                autoFocus
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email <span style={{ color: C.muted }}>(optional)</span></label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={styles.input}
                placeholder="your@email.com"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password <span style={{ color: C.muted }}>(min 6 chars)</span></label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Choose a password"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirm(e.target.value)}
                style={styles.input}
                placeholder="Repeat your password"
                required
              />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, ...(loading ? styles.btnDisabled : {}) }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
            <p style={{ color: C.muted, fontSize: '12px', textAlign: 'center', margin: 0 }}>
              Already have an account?{' '}
              <span style={{ color: C.sub, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setTab('signin')}>
                Sign in
              </span>
            </p>
          </form>
        </>
      )}
    </div>
  )

  if (isModal) return card

  return (
    <div style={styles.page}>{card}</div>
  )
}

const styles = {
  page:          { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0905', padding: '24px' },
  card:          { background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '420px', position: 'relative' },
  cardModal:     { boxShadow: '0 25px 60px rgba(0,0,0,0.5)' },
  closeBtn:      { position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: C.muted, fontSize: '18px', cursor: 'pointer', lineHeight: 1 },
  logoRow:       { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', justifyContent: 'center' },
  logoMark:      { width: '34px', height: '34px', borderRadius: '8px', background: C.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', color: '#fff' },
  logoText:      { fontSize: '18px', fontWeight: '700', color: C.text },
  messageBanner: { background: '#fef3c7', border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.accent}`, borderRadius: '8px', padding: '10px 14px', color: C.sub, fontSize: '13px', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start' },
  tabs:          { display: 'flex', background: '#fef3c7', borderRadius: '10px', padding: '4px', marginBottom: '20px', gap: '4px' },
  tabBtn:        { flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' },
  tabActive:     { background: '#fffef8', color: C.text, boxShadow: '0 1px 4px rgba(0,0,0,0.10)' },
  oauthSection:  { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '4px' },
  oauthBtn:      { display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', background: '#fef9c3', border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s', justifyContent: 'center' },
  divider:       { display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' },
  dividerLine:   { flex: 1, height: '1px', background: C.border },
  dividerText:   { color: C.muted, fontSize: '12px', whiteSpace: 'nowrap' },
  form:          { display: 'flex', flexDirection: 'column', gap: '14px' },
  field:         { display: 'flex', flexDirection: 'column', gap: '6px' },
  label:         { color: C.sub, fontSize: '13px', fontWeight: '500' },
  input:         { background: '#fef9c3', border: `1px solid ${C.border}`, borderRadius: '8px', color: C.text, padding: '10px 14px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  error:         { color: '#dc2626', fontSize: '13px', margin: 0 },
  submitBtn:     { background: C.gradient, border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: '700', padding: '12px', cursor: 'pointer', width: '100%', marginTop: '4px' },
  btnDisabled:   { opacity: 0.6, cursor: 'not-allowed' },
  signupNote:    { paddingTop: '8px' },
}
