import { useState } from 'react'

const C = {
  bg:      '#0d0905',
  card:    '#1a1108',
  surface: '#231708',
  border:  '#3d2510',
  accent:  '#f59e0b',
  warm:    '#ea580c',
  text:    '#fef3e2',
  sub:     '#c4935a',
  muted:   '#7a5c3a',
}

const sections = [
  { key: 'summaryFeedback',    label: 'Summary',        scoreKey: 'summaryScore',       max: 20, color: '#f59e0b' },
  { key: 'skillsFeedback',     label: 'Skills',         scoreKey: 'skillsScore',        max: 20, color: '#22c55e' },
  { key: 'experienceFeedback', label: 'Experience',     scoreKey: 'experienceScore',    max: 30, color: '#ea580c' },
  { key: 'formattingFeedback', label: 'Formatting',     scoreKey: 'formattingScore',    max: 15, color: '#38bdf8' },
  { key: 'overallFeedback',    label: 'Overall Action', scoreKey: null,                 max: null, color: '#d97706' },
]

function firstSentence(text) {
  if (!text) return 'No feedback available.'
  const m = text.match(/^.+?[.!?](?:\s|$)/)
  return m ? m[0].trim() : (text.length > 110 ? text.slice(0, 110) + '…' : text)
}

function downloadReport(analysis) {
  const scoreColor = analysis.score >= 83 ? '#22c55e' : analysis.score >= 56 ? '#f59e0b' : '#ef4444'
  const rows = sections.map(s => `
    <div style="margin:20px 0;padding:16px 20px;border-left:4px solid ${s.color};background:#fef9f0;border-radius:0 8px 8px 0">
      <h3 style="color:#92400e;margin:0 0 8px;font-size:15px">${s.label}${s.scoreKey && analysis[s.scoreKey] != null ? ` — ${analysis[s.scoreKey]}/${s.max}` : ''}</h3>
      <p style="color:#44403c;line-height:1.7;margin:0;font-size:14px">${analysis[s.key] || 'No feedback available.'}</p>
    </div>`).join('')

  const html = `<!DOCTYPE html><html><head><title>Resume Analysis — ${analysis.filename}</title>
    <style>body{font-family:'Times New Roman',serif;max-width:740px;margin:0 auto;padding:48px 32px;color:#1c1917;background:#fff}
    h1{font-size:26px;color:#92400e;border-bottom:2px solid #f59e0b;padding-bottom:12px;margin-bottom:4px}
    .score{font-size:72px;font-weight:900;color:${scoreColor};line-height:1}
    .meta{color:#78716c;font-size:13px;margin-bottom:32px}
    @media print{body{padding:24px}}</style></head>
    <body>
      <h1>Resume Analysis Report</h1>
      <p class="meta">File: <strong>${analysis.filename}</strong> &nbsp;·&nbsp; Analyzed: ${new Date(analysis.submittedAt).toLocaleString()} &nbsp;·&nbsp; Report #${analysis.id}</p>
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

      {/* Accordion */}
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
                {/* Color dot */}
                <span style={{ ...styles.dot, background: color }} />

                {/* Label + preview */}
                <div style={styles.sectionMeta}>
                  <span style={styles.sectionLabel}>{label}</span>
                  {!isOpen && <span style={styles.preview}>{preview}</span>}
                </div>

                {/* Score pill */}
                {score != null && (
                  <span style={{ ...styles.scorePill, background: color + '22', color, border: `1px solid ${color}55` }}>
                    {score}/{max}
                  </span>
                )}

                {/* Mini bar (only when collapsed) */}
                {pct != null && !isOpen && (
                  <div style={styles.miniBarTrack}>
                    <div style={{ ...styles.miniBarFill, width: `${pct}%`, background: color }} />
                  </div>
                )}

                {/* Arrow */}
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

      {/* Info strip */}
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
  container:    { background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '28px' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' },
  heading:      { fontSize: '19px', fontWeight: '700', color: C.text, marginBottom: '3px', fontStyle: 'italic' },
  filename:     { fontSize: '12px', color: C.muted },
  downloadBtn:  { background: 'transparent', border: `1px solid ${C.border}`, color: C.sub, padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap', transition: 'all 0.2s' },
  hint:         { color: C.muted, fontSize: '12px', marginBottom: '16px' },
  accordion:    { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  section:      { background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' },
  sectionOpen:  { border: `1px solid #3d2510`, boxShadow: `0 0 0 1px ${C.border}` },
  sectionHead:  { width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' },
  dot:          { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  sectionMeta:  { flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', overflow: 'hidden', minWidth: 0 },
  sectionLabel: { fontSize: '13px', fontWeight: '700', color: C.text },
  preview:      { fontSize: '12px', color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  scorePill:    { padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  miniBarTrack: { width: '60px', height: '4px', background: '#2a1708', borderRadius: '999px', overflow: 'hidden', flexShrink: 0 },
  miniBarFill:  { height: '100%', borderRadius: '999px', transition: 'width 0.8s ease' },
  arrow:        { color: C.muted, fontSize: '20px', transition: 'transform 0.25s', flexShrink: 0, lineHeight: 1 },
  arrowOpen:    { transform: 'rotate(90deg)', color: C.accent },
  sectionBody:  { padding: '0 16px 16px 38px', animation: 'fadeIn 0.2s ease' },
  bodyText:     { color: C.sub, lineHeight: '1.75', fontSize: '14px' },
  infoStrip:    { display: 'flex', gap: '10px' },
  infoCard:     { flex: 1, background: C.bg, borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', border: `1px solid ${C.border}` },
  infoLabel:    { fontSize: '10px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue:    { fontSize: '14px', fontWeight: '700', color: C.text },
}
