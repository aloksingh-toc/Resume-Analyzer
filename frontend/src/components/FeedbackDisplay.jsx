import { useState } from 'react'
import { C } from '../theme'

const sections = [
  { key: 'summaryFeedback',    label: 'Summary',        scoreKey: 'summaryScore',       max: 20, color: '#6366f1' },
  { key: 'skillsFeedback',     label: 'Skills',         scoreKey: 'skillsScore',        max: 20, color: '#8b5cf6' },
  { key: 'experienceFeedback', label: 'Experience',     scoreKey: 'experienceScore',    max: 30, color: '#3b82f6' },
  { key: 'formattingFeedback', label: 'Formatting',     scoreKey: 'formattingScore',    max: 15, color: '#0891b2' },
  { key: 'overallFeedback',    label: 'Overall Action', scoreKey: null,                 max: null, color: '#7c3aed' },
]

const KNOWN_SECTIONS = [
  'Contact Info', 'Professional Summary', 'Work Experience',
  'Education', 'Skills', 'Certifications', 'Projects',
  'LinkedIn/GitHub', 'Achievements',
]

function firstSentence(text) {
  if (!text) return 'No feedback available.'
  const m = text.match(/^.+?[.!?](?:\s|$)/)
  return m ? m[0].trim() : (text.length > 110 ? text.slice(0, 110) + '…' : text)
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function statusColor(score) {
  if (score >= 75) return '#16a34a'
  if (score >= 45) return '#d97706'
  return '#dc2626'
}

function downloadReport(analysis) {
  const scoreColor = analysis.score >= 83 ? '#16a34a' : analysis.score >= 56 ? '#d97706' : '#dc2626'
  const rows = sections.map(s => `
    <div style="margin:20px 0;padding:16px 20px;border-left:4px solid ${s.color};background:#f0f4ff;border-radius:0 8px 8px 0">
      <h3 style="color:#1e1b4b;margin:0 0 8px;font-size:15px">${escapeHtml(s.label)}${s.scoreKey && analysis[s.scoreKey] != null ? ` — ${analysis[s.scoreKey]}/${s.max}` : ''}</h3>
      <p style="color:#374151;line-height:1.7;margin:0;font-size:14px">${escapeHtml(analysis[s.key]) || 'No feedback available.'}</p>
    </div>`).join('')

  const html = `<!DOCTYPE html><html><head><title>Resume Analysis — ${escapeHtml(analysis.filename)}</title>
    <style>body{font-family:system-ui,sans-serif;max-width:740px;margin:0 auto;padding:48px 32px;color:#1c1917;background:#f8faff}
    h1{font-size:26px;color:#4338ca;border-bottom:2px solid #6366f1;padding-bottom:12px;margin-bottom:4px}
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

  const missing    = analysis.missingSections || []
  const hasKeywords = (analysis.keywordsFound?.length > 0) || (analysis.keywordsMissing?.length > 0)
  const hasJdMatch  = analysis.jdMatchScore != null
  const hasAts      = analysis.atsScore != null
  const hasSections = KNOWN_SECTIONS.length > 0

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.heading}>Detailed Feedback</h3>
          <p style={styles.filename}>{analysis.filename}{analysis.industry ? ` · ${analysis.industry}` : ''}</p>
        </div>
        <button onClick={() => downloadReport(analysis)} style={styles.downloadBtn}>
          Download Report
        </button>
      </div>

      {/* ── JD Match (Rec #1) ────────────────────────────────────────── */}
      {hasJdMatch && (
        <div style={styles.jdBanner}>
          <div style={styles.jdLeft}>
            <span style={styles.jdLabel}>JD Match</span>
            <span style={{ ...styles.jdScore, color: statusColor(analysis.jdMatchScore) }}>
              {analysis.jdMatchScore}%
            </span>
          </div>
          <div style={styles.jdBarTrack}>
            <div style={{ ...styles.jdBarFill, width: `${analysis.jdMatchScore}%`, background: statusColor(analysis.jdMatchScore) }} />
          </div>
          <span style={styles.jdTip}>
            {analysis.jdMatchScore >= 70
              ? 'Strong match — apply with confidence'
              : analysis.jdMatchScore >= 45
              ? 'Moderate match — add missing keywords below'
              : 'Low match — tailor your resume to this JD'}
          </span>
        </div>
      )}

      {/* ── ATS Score (Rec #6) ───────────────────────────────────────── */}
      {hasAts && (
        <div style={styles.atsRow}>
          <div style={styles.atsLeft}>
            <span style={styles.panelLabel}>ATS Compatibility</span>
            <span style={{ ...styles.atsScore, background: statusColor(analysis.atsScore) + '18', color: statusColor(analysis.atsScore), border: `1px solid ${statusColor(analysis.atsScore)}44` }}>
              {analysis.atsScore}/100
            </span>
          </div>
          {analysis.atsIssues?.length > 0 && (
            <ul style={styles.atsList}>
              {analysis.atsIssues.map((issue, i) => (
                <li key={i} style={styles.atsIssue}>{issue}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── Keywords (Rec #2) ────────────────────────────────────────── */}
      {hasKeywords && (
        <div style={styles.keywordsBox}>
          {analysis.keywordsFound?.length > 0 && (
            <div style={styles.kwGroup}>
              <span style={styles.panelLabel}>Found in Resume</span>
              <div style={styles.kwChips}>
                {analysis.keywordsFound.map(kw => (
                  <span key={kw} style={styles.kwFound}>{kw}</span>
                ))}
              </div>
            </div>
          )}
          {analysis.keywordsMissing?.length > 0 && (
            <div style={styles.kwGroup}>
              <span style={styles.panelLabel}>
                Missing Keywords{hasJdMatch ? ' (from JD)' : ' (recommended)'}
              </span>
              <div style={styles.kwChips}>
                {analysis.keywordsMissing.map(kw => (
                  <span key={kw} style={styles.kwMissing}>{kw}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Sections Checklist (Rec #8) ──────────────────────────────── */}
      {hasSections && (
        <div style={styles.sectionsBox}>
          <span style={styles.panelLabel}>Resume Sections Checklist</span>
          <div style={styles.sectionsGrid}>
            {KNOWN_SECTIONS.map(sec => {
              const ok = !missing.includes(sec)
              return (
                <div key={sec} style={{ ...styles.secRow, ...(ok ? styles.secOk : styles.secBad) }}>
                  <span style={styles.secIcon}>{ok ? '✓' : '✗'}</span>
                  <span>{sec}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Accordion (section feedback) ─────────────────────────────── */}
      <p style={styles.hint}>Click any section to read the full feedback.</p>

      <div style={styles.accordion}>
        {sections.map(({ key, label, scoreKey, max, color }) => {
          const score   = scoreKey ? analysis[scoreKey] : null
          const pct     = score != null ? Math.round((score / max) * 100) : null
          const text    = analysis[key] || ''
          const isOpen  = expanded === key

          return (
            <div key={key} style={{ ...styles.section, ...(isOpen ? styles.sectionOpen : {}) }}>
              <button style={styles.sectionHead} onClick={() => toggle(key)}>
                <span style={{ ...styles.dot, background: color }} />
                <div style={styles.sectionMeta}>
                  <span style={styles.sectionLabel}>{label}</span>
                  {!isOpen && <span style={styles.preview}>{firstSentence(text)}</span>}
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

      {/* ── Info Strip ───────────────────────────────────────────────── */}
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
  container:    { background: C.card_light, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '28px', boxShadow: '0 4px 24px rgba(99,102,241,0.10)' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' },
  heading:      { fontSize: '19px', fontWeight: '700', color: C.text, marginBottom: '3px' },
  filename:     { fontSize: '12px', color: C.muted },
  downloadBtn:  { background: 'transparent', border: `1px solid ${C.border}`, color: C.sub, padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' },
  panelLabel:   { display: 'block', fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' },

  // JD Match
  jdBanner:     { background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' },
  jdLeft:       { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
  jdLabel:      { fontSize: '11px', fontWeight: '700', color: '#4338ca', textTransform: 'uppercase', letterSpacing: '0.6px' },
  jdScore:      { fontSize: '28px', fontWeight: '900', lineHeight: 1 },
  jdBarTrack:   { flex: 1, minWidth: '80px', height: '6px', background: '#ddd6fe', borderRadius: '999px', overflow: 'hidden' },
  jdBarFill:    { height: '100%', borderRadius: '999px', transition: 'width 1s ease' },
  jdTip:        { fontSize: '12px', color: '#6b7280', fontStyle: 'italic', flex: '0 0 100%' },

  // ATS
  atsRow:       { background: '#f8faff', border: '1px solid #e0e7ff', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' },
  atsLeft:      { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
  atsScore:     { padding: '3px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: '800' },
  atsList:      { margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' },
  atsIssue:     { fontSize: '12px', color: '#dc2626', lineHeight: '1.5' },

  // Keywords
  keywordsBox:  { background: '#f8faff', border: '1px solid #e0e7ff', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '12px' },
  kwGroup:      {},
  kwChips:      { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  kwFound:      { padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' },
  kwMissing:    { padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' },

  // Sections checklist
  sectionsBox:  { background: '#f8faff', border: '1px solid #e0e7ff', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' },
  sectionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '6px' },
  secRow:       { display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '500' },
  secOk:        { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
  secBad:       { background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' },
  secIcon:      { fontWeight: '800', fontSize: '13px', flexShrink: 0 },

  // Accordion
  hint:         { color: C.muted, fontSize: '12px', marginBottom: '12px' },
  accordion:    { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  section:      { background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' },
  sectionOpen:  { border: '1px solid #a5b4fc' },
  sectionHead:  { width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' },
  dot:          { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  sectionMeta:  { flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', overflow: 'hidden', minWidth: 0 },
  sectionLabel: { fontSize: '13px', fontWeight: '700', color: C.text },
  preview:      { fontSize: '12px', color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  scorePill:    { padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  miniBarTrack: { width: '60px', height: '4px', background: '#ddd6fe', borderRadius: '999px', overflow: 'hidden', flexShrink: 0 },
  miniBarFill:  { height: '100%', borderRadius: '999px', transition: 'width 0.8s ease' },
  arrow:        { color: C.muted, fontSize: '20px', transition: 'transform 0.25s', flexShrink: 0, lineHeight: 1 },
  arrowOpen:    { transform: 'rotate(90deg)', color: '#6366f1' },
  sectionBody:  { padding: '0 16px 16px 38px', animation: 'fadeIn 0.2s ease' },
  bodyText:     { color: C.sub, lineHeight: '1.75', fontSize: '14px' },

  // Info strip
  infoStrip:    { display: 'flex', gap: '10px' },
  infoCard:     { flex: 1, background: '#eef2ff', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', border: `1px solid ${C.border}` },
  infoLabel:    { fontSize: '10px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue:    { fontSize: '14px', fontWeight: '700', color: C.text },
}
