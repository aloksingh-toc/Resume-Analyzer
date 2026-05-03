import { statusColor } from '../../theme'

export default function JdMatchPanel({ jdMatchScore }) {
  if (jdMatchScore == null) return null
  const color = statusColor(jdMatchScore)
  const tip   = jdMatchScore >= 70
    ? 'Strong match — apply with confidence'
    : jdMatchScore >= 45
    ? 'Moderate match — add missing keywords below'
    : 'Low match — tailor your resume to this JD'

  return (
    <div style={styles.banner}>
      <div style={styles.left}>
        <span style={styles.label}>JD Match</span>
        <span style={{ ...styles.score, color }}>{jdMatchScore}%</span>
      </div>
      <div style={styles.barTrack}>
        <div style={{ ...styles.barFill, width: `${jdMatchScore}%`, background: color }} />
      </div>
      <span style={styles.tip}>{tip}</span>
    </div>
  )
}

const styles = {
  banner:   { background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' },
  left:     { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
  label:    { fontSize: '11px', fontWeight: '700', color: '#4338ca', textTransform: 'uppercase', letterSpacing: '0.6px' },
  score:    { fontSize: '28px', fontWeight: '900', lineHeight: 1 },
  barTrack: { flex: 1, minWidth: '80px', height: '6px', background: '#ddd6fe', borderRadius: '999px', overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: '999px', transition: 'width 1s ease' },
  tip:      { fontSize: '12px', color: '#6b7280', fontStyle: 'italic', flex: '0 0 100%' },
}
