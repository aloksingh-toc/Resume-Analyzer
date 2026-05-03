import { C } from '../theme'
import { downloadReport } from '../utils/reportDownload'
import JdMatchPanel      from './feedback/JdMatchPanel'
import AtsPanel          from './feedback/AtsPanel'
import KeywordsPanel     from './feedback/KeywordsPanel'
import SectionsChecklist from './feedback/SectionsChecklist'
import FeedbackAccordion from './feedback/FeedbackAccordion'

export default function FeedbackDisplay({ analysis }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.heading}>Detailed Feedback</h3>
          <p style={styles.filename}>
            {analysis.filename}{analysis.industry ? ` · ${analysis.industry}` : ''}
          </p>
        </div>
        <button onClick={() => downloadReport(analysis)} style={styles.downloadBtn}>
          Download Report
        </button>
      </div>

      <JdMatchPanel      jdMatchScore={analysis.jdMatchScore} />
      <AtsPanel          atsScore={analysis.atsScore} atsIssues={analysis.atsIssues} />
      <KeywordsPanel     keywordsFound={analysis.keywordsFound}
                         keywordsMissing={analysis.keywordsMissing}
                         hasJdMatch={analysis.jdMatchScore != null} />
      <SectionsChecklist missingSections={analysis.missingSections} />
      <FeedbackAccordion analysis={analysis} />

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
  container:   { background: C.card_light, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '28px', boxShadow: '0 4px 24px rgba(99,102,241,0.10)' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' },
  heading:     { fontSize: '19px', fontWeight: '700', color: C.text, marginBottom: '3px' },
  filename:    { fontSize: '12px', color: C.muted },
  downloadBtn: { background: 'transparent', border: `1px solid ${C.border}`, color: C.sub, padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' },
  infoStrip:   { display: 'flex', gap: '10px' },
  infoCard:    { flex: 1, background: '#eef2ff', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', border: `1px solid ${C.border}` },
  infoLabel:   { fontSize: '10px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue:   { fontSize: '14px', fontWeight: '700', color: C.text },
}
