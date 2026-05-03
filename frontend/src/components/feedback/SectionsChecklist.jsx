// NOTE: This list must stay in sync with the missingSectionsRules() in AIService.java
export const KNOWN_SECTIONS = [
  'Contact Info', 'Professional Summary', 'Work Experience',
  'Education', 'Skills', 'Certifications', 'Projects',
  'LinkedIn/GitHub', 'Achievements',
]

export default function SectionsChecklist({ missingSections }) {
  const missing = missingSections || []

  return (
    <div style={styles.wrap}>
      <span style={styles.label}>Resume Sections Checklist</span>
      <div style={styles.grid}>
        {KNOWN_SECTIONS.map(sec => {
          const ok = !missing.includes(sec)
          return (
            <div key={sec} style={{ ...styles.row, ...(ok ? styles.ok : styles.bad) }}>
              <span style={styles.icon}>{ok ? '✓' : '✗'}</span>
              <span>{sec}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  wrap:  { background: '#f8faff', border: '1px solid #e0e7ff', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' },
  label: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' },
  grid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '6px', alignItems: 'start' },
  row:   { display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '500', height: '32px' },
  ok:    { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
  bad:   { background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' },
  icon:  { fontWeight: '800', fontSize: '13px', flexShrink: 0 },
}
