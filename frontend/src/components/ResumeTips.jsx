const tips = [
  { icon: '✦', title: 'Quantify achievements', body: 'Use numbers — "Led team of 8" beats "Led a team".' },
  { icon: '✦', title: 'Strong action verbs',   body: 'Start bullets with Led, Built, Reduced, Grew.' },
  { icon: '✦', title: 'ATS-friendly format',   body: 'Keep to 1–2 pages. No tables, no columns.' },
  { icon: '✦', title: 'Tailor every apply',    body: 'Mirror keywords directly from the job description.' },
]

export default function ResumeTips() {
  return (
    <div style={styles.wrap}>
      <p style={styles.heading}>Quick Wins Before You Upload</p>
      <div style={styles.grid}>
        {tips.map(({ icon, title, body }) => (
          <div key={title} style={styles.card}>
            <span style={styles.icon}>{icon}</span>
            <div>
              <p style={styles.title}>{title}</p>
              <p style={styles.body}>{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  wrap:    { width: '100%', maxWidth: '620px' },
  heading: { color: '#a16207', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginBottom: '12px', textAlign: 'center' },
  grid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  card:    { display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'linear-gradient(145deg, #fffef8, #fef9c3)', border: '1px solid #f0d070', borderRadius: '10px', padding: '12px 14px', boxShadow: '0 2px 8px rgba(245,158,11,0.08)' },
  icon:    { color: '#f59e0b', fontSize: '12px', marginTop: '2px', flexShrink: 0 },
  title:   { color: '#78350f', fontSize: '12px', fontWeight: '700', marginBottom: '2px' },
  body:    { color: '#a16207', fontSize: '12px', lineHeight: '1.5' },
}
