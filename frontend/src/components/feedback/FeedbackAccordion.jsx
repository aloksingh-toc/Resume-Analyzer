import { useState } from 'react'
import { C } from '../../theme'

const SECTIONS = [
  { key: 'summaryFeedback',    label: 'Summary',        scoreKey: 'summaryScore',    max: 20,   color: '#6366f1' },
  { key: 'skillsFeedback',     label: 'Skills',         scoreKey: 'skillsScore',     max: 20,   color: '#8b5cf6' },
  { key: 'experienceFeedback', label: 'Experience',     scoreKey: 'experienceScore', max: 30,   color: '#3b82f6' },
  { key: 'formattingFeedback', label: 'Formatting',     scoreKey: 'formattingScore', max: 15,   color: '#0891b2' },
  { key: 'overallFeedback',    label: 'Overall Action', scoreKey: null,              max: null, color: '#7c3aed' },
]

function firstSentence(text) {
  if (!text) return 'No feedback available.'
  const m = text.match(/^.+?[.!?](?:\s|$)/)
  return m ? m[0].trim() : (text.length > 110 ? text.slice(0, 110) + '…' : text)
}

export default function FeedbackAccordion({ analysis }) {
  const [expanded, setExpanded] = useState(null)
  const toggle = key => setExpanded(prev => prev === key ? null : key)

  return (
    <>
      <p style={styles.hint}>Click any section to read the full feedback.</p>
      <div style={styles.accordion}>
        {SECTIONS.map(({ key, label, scoreKey, max, color }) => {
          const score  = scoreKey ? analysis[scoreKey] : null
          const pct    = score != null ? Math.round((score / max) * 100) : null
          const text   = analysis[key] || ''
          const isOpen = expanded === key

          return (
            <div key={key} style={{ ...styles.section, ...(isOpen ? styles.sectionOpen : {}) }}>
              <button style={styles.head} onClick={() => toggle(key)}>
                <span style={{ ...styles.dot, background: color }} />
                <div style={styles.meta}>
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
                <div style={styles.body}>
                  <p style={styles.bodyText}>{text || 'No feedback available for this section.'}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

const styles = {
  hint:         { color: C.muted, fontSize: '12px', marginBottom: '12px' },
  accordion:    { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  section:      { background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' },
  sectionOpen:  { border: '1px solid #a5b4fc' },
  head:         { width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' },
  dot:          { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  meta:         { flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', overflow: 'hidden', minWidth: 0 },
  sectionLabel: { fontSize: '13px', fontWeight: '700', color: C.text },
  preview:      { fontSize: '12px', color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  scorePill:    { padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  miniBarTrack: { width: '60px', height: '4px', background: '#ddd6fe', borderRadius: '999px', overflow: 'hidden', flexShrink: 0 },
  miniBarFill:  { height: '100%', borderRadius: '999px', transition: 'width 0.8s ease' },
  arrow:        { color: C.muted, fontSize: '20px', transition: 'transform 0.25s', flexShrink: 0, lineHeight: 1 },
  arrowOpen:    { transform: 'rotate(90deg)', color: '#6366f1' },
  body:         { padding: '0 16px 16px 38px', animation: 'fadeIn 0.2s ease' },
  bodyText:     { color: C.sub, lineHeight: '1.75', fontSize: '14px' },
}
