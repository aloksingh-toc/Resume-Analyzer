import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function UploadSection({ onAnalyze, loading }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('')
    if (rejectedFiles.length > 0) {
      setError('Please upload a valid PDF file (max 5MB).')
      return
    }
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: loading,
  })

  const handleAnalyze = () => {
    if (!selectedFile) {
      setError('Please select a PDF file first.')
      return
    }
    onAnalyze(selectedFile)
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setError('')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.iconWrap}>📄</div>
        <h2 style={styles.title}>Upload Your Resume</h2>
        <p style={styles.subtitle}>
          Get an AI-powered score and actionable feedback in seconds
        </p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        style={{
          ...styles.dropzone,
          ...(isDragActive ? styles.dropzoneActive : {}),
          ...(loading ? styles.dropzoneDisabled : {}),
        }}
      >
        <input {...getInputProps()} />
        {selectedFile ? (
          <div style={styles.filePreview}>
            <span style={styles.fileIcon}>📎</span>
            <div>
              <p style={styles.fileName}>{selectedFile.name}</p>
              <p style={styles.fileSize}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        ) : (
          <div style={styles.dropContent}>
            <div style={styles.uploadIcon}>⬆️</div>
            <p style={styles.dropText}>
              {isDragActive ? 'Drop your PDF here...' : 'Drag & drop your resume PDF here'}
            </p>
            <p style={styles.dropHint}>or click to browse · Max 5MB</p>
          </div>
        )}
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Buttons */}
      <div style={styles.btnRow}>
        {selectedFile && !loading && (
          <button onClick={handleRemove} style={styles.removeBtn}>
            Remove
          </button>
        )}
        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || loading}
          style={{
            ...styles.analyzeBtn,
            ...(!selectedFile || loading ? styles.analyzeBtnDisabled : {}),
          }}
        >
          {loading ? (
            <span style={styles.loadingInner}>
              <span style={styles.spinner} /> Analyzing...
            </span>
          ) : (
            '🔍 Analyze Resume'
          )}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'linear-gradient(135deg, #1e293b 0%, #1a2540 100%)',
    border: '1px solid #334155',
    borderRadius: '20px',
    padding: '36px',
    maxWidth: '620px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  iconWrap: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  dropzone: {
    border: '2px dashed #334155',
    borderRadius: '14px',
    padding: '40px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: '#0f172a',
    marginBottom: '16px',
  },
  dropzoneActive: {
    borderColor: '#6366f1',
    background: '#1e1b4b',
  },
  dropzoneDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  dropContent: {},
  uploadIcon: {
    fontSize: '36px',
    marginBottom: '12px',
  },
  dropText: {
    color: '#cbd5e1',
    fontWeight: '500',
    fontSize: '16px',
    marginBottom: '6px',
  },
  dropHint: {
    color: '#64748b',
    fontSize: '13px',
  },
  filePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    justifyContent: 'center',
  },
  fileIcon: {
    fontSize: '32px',
  },
  fileName: {
    color: '#e2e8f0',
    fontWeight: '600',
    fontSize: '15px',
    textAlign: 'left',
  },
  fileSize: {
    color: '#64748b',
    fontSize: '13px',
    textAlign: 'left',
  },
  error: {
    color: '#f87171',
    fontSize: '13px',
    marginBottom: '12px',
    textAlign: 'center',
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  removeBtn: {
    background: 'transparent',
    border: '1px solid #475569',
    color: '#94a3b8',
    padding: '12px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  analyzeBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    color: '#fff',
    padding: '12px 32px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s',
    flex: 1,
    maxWidth: '220px',
  },
  analyzeBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  loadingInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
}
