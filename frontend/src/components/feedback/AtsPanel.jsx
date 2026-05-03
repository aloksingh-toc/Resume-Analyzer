import { statusColor } from '../../theme'

export default function AtsPanel({ atsScore, atsIssues }) {
  if (atsScore == null) return null
  const color = statusColor(atsScore)

  return (
    <div style={styles.wrap}>
      <div style={styles.top}>
        <span style={styles.label}>ATS Compatibility</span>
        <span style={{ ...styles.badge, background: color + '18', color, border: `1px solid ${color}44` }}>
          {atsScore}/100
        </span>
      </div>
      {atsIssues?.length > 0 && (
        <ul style={styles.list}>
          {atsIssues.map((issue, i) => <li key={i} style={styles.issue}>{issue}</li>)}
        </ul>
      )}
    </div>
  )
}

const styles = {
  wrap:  { background: '#f8faff', border: '1px solid #e0e7ff', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' },
  top:   { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
  label: { fontSize: '11px', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.6px' },
  badge: { padding: '3px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: '800' },
  list:  { margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' },
  issue: { fontSize: '12px', color: '#dc2626', lineHeight: '1.5' },
}
