import { darkTokens as D } from '../theme'

const steps = [
  { num: '01', title: 'Upload Your Resume',      color: '#6366f1', desc: 'Drop your PDF resume. Optionally paste a job description for keyword match scoring.' },
  { num: '02', title: 'AI Scores Every Section', color: '#8b5cf6', desc: 'Our AI reviews summary, skills, experience, formatting, and ATS compatibility in seconds.' },
  { num: '03', title: 'Fix & Land Interviews',   color: '#3b82f6', desc: 'Get specific, actionable feedback on missing keywords, weak areas, and quick wins.' },
]

export default function HowItWorks() {
  return (
    <div style={styles.wrap}>
      <p style={styles.label}>HOW IT WORKS</p>
      <div className="hiw-grid">
        {steps.map((s, i) => (
          <div key={s.num} style={styles.card}>
            <div style={{ ...styles.numBadge, background: s.color + '18', border: `1px solid ${s.color}33` }}>
              <span style={{ ...styles.num, color: s.color }}>{s.num}</span>
            </div>
            {i < steps.length - 1 && <div style={styles.connector} className="hiw-connector" />}
            <h3 style={styles.title}>{s.title}</h3>
            <p style={styles.desc}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  wrap:      { width: '100%', maxWidth: '860px', margin: '0 auto', textAlign: 'center' },
  label:     { fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: D.textMuted, marginBottom: '20px' },
  card:      { background: 'rgba(255,255,255,0.04)', border: `1px solid ${D.border}`, borderRadius: '16px', padding: '28px 24px', position: 'relative', textAlign: 'left' },
  numBadge:  { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
  num:       { fontSize: '18px', fontWeight: '900', lineHeight: 1 },
  connector: { position: 'absolute', top: '38px', right: '-18px', width: '36px', height: '2px', background: `linear-gradient(90deg, ${D.border}, transparent)`, zIndex: 1 },
  title:     { fontSize: '15px', fontWeight: '700', color: D.text, marginBottom: '8px' },
  desc:      { fontSize: '13px', color: D.textMuted, lineHeight: '1.65' },
}
