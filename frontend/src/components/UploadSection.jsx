import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const C = {
  card:    'linear-gradient(145deg, #fffef8, #fef9c3)',
  surface: 'linear-gradient(145deg, #fef9c3, #fef3c7)',
  border:  '#f0d070',
  accent:  '#f59e0b',
  grad:    'linear-gradient(135deg, #f59e0b, #ea580c)',
  text:    '#1c1917',
  sub:     '#78350f',
  muted:   '#a16207',
}

export default function UploadSection({ onAnalyze, loading }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError]               = useState('')

  const onDrop = useCallback((accepted, rejected) => {
    setError('')
    if (rejected.length > 0) { setError('Please upload a valid PDF file (max 5 MB).'); return }
    if (accepted.length > 0)  setSelectedFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: loading,
  })

  const handleAnalyze = () => {
    if (!selectedFile) { setError('Please select a PDF file first.'); return }
    onAnalyze(selectedFile)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.iconWrap}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </div>
        <h2 style={styles.title}>Upload Your Resume</h2>
        <p style={styles.subtitle}>PDF only · Max 5 MB · Results in under 20 seconds</p>
      </div>

      <div
        {...getRootProps()}
        style={{
          ...styles.dropzone,
          ...(isDragActive ? styles.dzActive : {}),
          ...(loading      ? styles.dzDisabled : {}),
        }}
      >
        <input {...getInputProps()} />
        {selectedFile ? (
          <div style={styles.filePreview}>
            <div style={styles.fileIconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <div>
              <p style={styles.fileName}>{selectedFile.name}</p>
              <p style={styles.fileSize}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        ) : (
          <div style={styles.dropContent}>
            <div style={styles.uploadIcon}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={isDragActive ? '#f59e0b' : '#a16207'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16,16 12,12 8,16"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
            </div>
            <p style={styles.dropText}>{isDragActive ? 'Drop it here…' : 'Drag & drop your resume PDF'}</p>
            <p style={styles.dropHint}>or click to browse</p>
          </div>
        )}
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.btnRow}>
        {selectedFile && !loading && (
          <button onClick={() => { setSelectedFile(null); setError('') }} style={styles.removeBtn}>
            Remove
          </button>
        )}
        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || loading}
          style={{ ...styles.analyzeBtn, ...(!selectedFile || loading ? styles.btnDisabled : {}) }}
        >
          {loading ? (
            <span style={styles.loadingInner}>
              <span style={styles.spinner} /> Analyzing…
            </span>
          ) : 'Analyze Resume'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container:    { background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '36px', maxWidth: '580px', margin: '0 auto', width: '100%', boxShadow: '0 4px 24px rgba(245,158,11,0.10)' },
  header:       { textAlign: 'center', marginBottom: '24px' },
  iconWrap:     { width: '52px', height: '52px', background: '#fff8e1', border: `1px solid ${C.border}`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' },
  title:        { fontSize: '22px', fontWeight: '700', color: C.text, marginBottom: '6px' },
  subtitle:     { fontSize: '13px', color: C.muted },
  dropzone:     { border: `2px dashed ${C.border}`, borderRadius: '14px', padding: '36px 24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: C.surface, marginBottom: '14px' },
  dzActive:     { borderColor: C.accent, background: '#fef3c7', boxShadow: `0 0 20px rgba(245,158,11,0.20)` },
  dzDisabled:   { opacity: 0.5, cursor: 'not-allowed' },
  filePreview:  { display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center' },
  fileIconWrap: { width: '44px', height: '44px', background: '#fff8e1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  fileName:     { color: C.text, fontWeight: '600', fontSize: '14px', textAlign: 'left', marginBottom: '2px' },
  fileSize:     { color: C.muted, fontSize: '12px', textAlign: 'left' },
  dropContent:  {},
  uploadIcon:   { marginBottom: '12px' },
  dropText:     { color: C.sub, fontWeight: '500', fontSize: '15px', marginBottom: '4px' },
  dropHint:     { color: C.muted, fontSize: '13px' },
  error:        { color: '#dc2626', fontSize: '13px', marginBottom: '10px', textAlign: 'center' },
  btnRow:       { display: 'flex', gap: '12px', justifyContent: 'center' },
  removeBtn:    { background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, padding: '11px 22px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  analyzeBtn:   { background: C.grad, border: 'none', color: '#fff', padding: '12px 32px', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', flex: 1, maxWidth: '220px', boxShadow: '0 4px 14px rgba(245,158,11,0.30)' },
  btnDisabled:  { opacity: 0.45, cursor: 'not-allowed', boxShadow: 'none' },
  loadingInner: { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' },
  spinner:      { display: 'inline-block', width: '15px', height: '15px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
}
