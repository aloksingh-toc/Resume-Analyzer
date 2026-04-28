import { useState } from 'react'
import { C } from '../theme'

const sections = [
  { key: 'summaryFeedback',    label: 'Summary',        scoreKey: 'summaryScore',       max: 20, color: '#d97706' },
  { key: 'skillsFeedback',     label: 'Skills',         scoreKey: 'skillsScore',        max: 20, color: '#16a34a' },
  { key: 'experienceFeedback', label: 'Experience',     scoreKey: 'experienceScore',    max: 30, color: '#ea580c' },
  { key: 'formattingFeedback', label: 'Formatting',     scoreKey: 'formattingScore',    max: 15, color: '#0284c7' },
  { key: 'overallFeedback',    label: 'Overall Action', scoreKey: null,                 max: null, color: '#7c3aed' },
]

function firstSentence(text) {
  if (!text) return 'No feedback available.'
  const m = text.match(/^.+?[.!?](?:\s|$)/)
  return m ? m[0].trim() : (text.length > 110 ? text.slice(0, 110) + '…' : text)
}

/** Escapes user-controlled strings before injecting into the print HTML. */
function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function downloadReport(analysis) {
  const scoreColor = analysis.score >= 83 ? '#16a34a' : analysis.score >= 56 ? '#d97706' : '#dc2626'
  const rows = sections.map(s => `
    <div style="margin:20px 0;padding:16px 20px;border-left:4px solid ${s.color};background:#fef9c3;border-radius:0 8px 8px 0">
      <h3 style="color:#92400e;margin:0 0 8px;font-size:15px">${escapeHtml(s.label)}${s.scoreKey && analysis[s.scoreKey] != null ? ` — ${analysis[s.scoreKey]}/${s.max}` : ''}</h3>
      <p style="color:#44403c;line-height:1.7;margin:0;font-size:14px">${escapeHtml(analysis[s.key]) || 'No feedback available.'}</p>
    </div>`).join('')

  const html = `<!DOCTYPE html><html><head><title>Resume Analysis — ${escapeHtml(analysis.filename)}</title>
    <style>body{font-family:system-ui,sans-serif;max-width:740px;margin:0 auto;padding:48px 32px;color:#1c1917;background:#fffef8}
    h1{font-size:26px;color:#92400e;border-bottom:2px solid #f59e0b;padding-bottom:12px;margin-bottom:4px}
    .score{font-size:72px;font-weight:900;color:${scoreColor};line-height:1}
    .meta{color:#78716c;font-size:13px;margin-bottom:32px}
    @media print{body{padding:24px}}</style></head>
    <body>
      <h1>Resume Analysis Report</h1>
      <p class="meta">File: <strong>${escapeHtml(analysis.filename)}</strong> &nbsp;·&nbsp; Analyzed: ${new Date(analysis.submittedAt).toLocaleString()} &nbsp;·&nbsp; Report #${analysis.id}</p>
      <div style="text-align:center;margin:32px 0 24px">
        <div class="score">${analysis.score}</div>
        <p style="color:#78716c;margin:4px 0 0">/100 overall score</p>
      </div>
      ${rows}
    </body></html>`

  const w = window.open('', '_blank', 'width=820,height=700')
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 400)
}

export default function FeedbackDisplay({ analysis }) {
  const [expanded, setExpanded] = useState(null)

  const toggle = (key) => setExpanded(prev => prev === key ? null : key)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.heading}>Detailed Feedback</h3>
          <p style={styles.filename}>{analysis.filename}</p>
        </div>
        <button onClick={() => downloadReport(analysis)} style={styles.downloadBtn}>
          ↓ Download Report
        </button>
      </div>

      <p style={styles.hint}>Click any section to read the full feedback.</p>

      <div style={styles.accordion}>
        {sections.map(({ key, label, scoreKey, max, color }) => {
          const score    = scoreKey ? analysis[scoreKey] : null
          const pct      = score != null ? Math.round((score / max) * 100) : null
          const text     = analysis[key] || ''
          const isOpen   = expanded === key
          const preview  = firstSentence(text)

          return (
            <div key={key} style={{ ...styles.section, ...(isOpen ? styles.sectionOpen : {}) }}>
              <button style={styles.sectionHead} onClick={() => toggle(key)}>
                <span style={{ ...styles.dot, background: color }} />
                <div style={styles.sectionMeta}>
                  <span style={styles.sectionLabel}>{label}</span>
                  {!isOpen && <span style={styles.preview}>{preview}</span>}
                </div>
                {score != null && (
                  <span style={{ ...styles.scorePill, background: color + '18', color, border: `1px solid ${color}44` }}>
                    {score}/{max}
                  </span>
                )}
                {pct != null && !isOpen && (
                  <div style={styles.miniBarTrack}>
                    <div style={{ ...styles.miniBarFill, width: `${pct}%`, background: color }} />
                  </div>
                )}
                <span style={{ ...styles.arrow, ...(isOpen ? styles.arrowOpen : {}) }}>›</span>
              </button>

              {isOpen && (
                <div style={styles.sectionBody}>
                  <p style={styles.bodyText}>{text || 'No feedback available for this section.'}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={styles.infoStrip}>
        {[
          { label: 'Overall Score', value: `${analysis.score}/100` },
          { label: 'Analyzed',      value: new Date(analysis.submittedAt).toLocaleDateString() },
          { label: 'Report ID',     value: `#${analysis.id}` },
        ].map(({ label, value }) => (
          <div key={label} style={styles.infoCard}>
            <span style={styles.infoLabel}>{label}</span>
            <span style={styles.infoValue}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container:    { background: C.card_light, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '28px', boxShadow: '0 4px 24px rgba(245,158,11,0.10)' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' },
  heading:      { fontSize: '19px', fontWeight: '700', color: C.text, marginBottom: '3px' },
  filename:     { fontSize: '12px', color: C.muted },
  downloadBtn:  { background: 'transparent', border: `1px solid ${C.border}`, color: C.sub, padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' },
  hint:         { color: C.muted, fontSize: '12px', marginBottom: '16px' },
  accordion:    { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  section:      { background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' },
  sectionOpen:  { border: `1px solid #a5b4fc` },
  sectionHead:  { width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' },
  dot:          { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  sectionMeta:  { flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', overflow: 'hidden', minWidth: 0 },
  sectionLabel: { fontSize: '13px', fontWeight: '700', color: C.text },
  preview:      { fontSize: '12px', color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  scorePill:    { padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  miniBarTrack: { width: '60px', height: '4px', background: '#fde68a', borderRadius: '999px', overflow: 'hidden', flexShrink: 0 },
  miniBarFill:  { height: '100%', borderRadius: '999px', transition: 'width 0.8s ease' },
  arrow:        { color: C.muted, fontSize: '20px', transition: 'transform 0.25s', flexShrink: 0, lineHeight: 1 },
  arrowOpen:    { transform: 'rotate(90deg)', color: '#f59e0b' },
  sectionBody:  { padding: '0 16px 16px 38px', animation: 'fadeIn 0.2s ease' },
  bodyText:     { color: C.sub, lineHeight: '1.75', fontSize: '14px' },
  infoStrip:    { display: 'flex', gap: '10px' },
  infoCard:     { flex: 1, background: '#eef2ff', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', border: `1px solid ${C.border}` },
  infoLabel:    { fontSize: '10px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue:    { fontSize: '14px', fontWeight: '700', color: C.text },
}
