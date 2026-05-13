import { C } from '../theme'

const tips = [
  { title: 'Quantify achievements', body: 'Use numbers — "Led team of 8" beats "Led a team".' },
  { title: 'Strong action verbs',   body: 'Start bullets with Led, Built, Reduced, Grew.' },
  { title: 'ATS-friendly format',   body: 'Keep to 1–2 pages. No tables, no columns.' },
  { title: 'Tailor every apply',    body: 'Mirror keywords directly from the job description.' },
]

export default function ResumeTips() {
  return (
    <div style={styles.wrap}>
      <p style={styles.heading}>Quick Wins Before You Upload</p>
      <div style={styles.grid} className="tips-grid">
        {tips.map(({ title, body }) => (
          <div key={title} style={styles.card}>
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
  heading: { color: C.muted, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginBottom: '12px', textAlign: 'center' },
  grid:    { gap: '10px' },
  card:    { background: C.card_light, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '12px 14px', boxShadow: '0 2px 8px rgba(99,102,241,0.06)' },
  title:   { color: C.sub, fontSize: '12px', fontWeight: '700', marginBottom: '2px' },
  body:    { color: C.muted, fontSize: '12px', lineHeight: '1.5' },
}
