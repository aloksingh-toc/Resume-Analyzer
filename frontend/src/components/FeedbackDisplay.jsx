import { useState } from 'react'

const sections = [
  { key: 'summaryFeedback',     label: 'Summary',     icon: '📋', color: '#6366f1' },
  { key: 'skillsFeedback',      label: 'Skills',      icon: '🛠️', color: '#22c55e' },
  { key: 'experienceFeedback',  label: 'Experience',  icon: '💼', color: '#f59e0b' },
  { key: 'formattingFeedback',  label: 'Formatting',  icon: '🎨', color: '#ec4899' },
  { key: 'overallFeedback',     label: 'Overall',     icon: '⭐', color: '#38bdf8' },
]

export default function FeedbackDisplay({ analysis }) {
  const [active, setActive] = useState('summaryFeedback')

  const current = sections.find(s => s.key === active)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.heading}>Detailed Feedback</h3>
        <p style={styles.filename}>📎 {analysis.filename}</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {sections.map(({ key, label, icon, color }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            style={{
              ...styles.tab,
              ...(active === key ? { ...styles.tabActive, borderColor: color, color } : {}),
            }}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Feedback Content */}
      <div style={{ ...styles.feedbackBox, borderLeft: `3px solid ${current.color}` }}>
        <div style={styles.feedbackHeader}>
          <span style={{ fontSize: '22px' }}>{current.icon}</span>
          <h4 style={{ ...styles.feedbackTitle, color: current.color }}>{current.label}</h4>
        </div>
        <p style={styles.feedbackText}>
          {analysis[active] || 'No feedback available for this section.'}
        </p>
      </div>

      {/* Quick Info Row */}
      <div style={styles.infoRow}>
        <div style={styles.infoCard}>
          <span style={styles.infoIcon}>🏆</span>
          <span style={styles.infoLabel}>Score</span>
          <span style={styles.infoValue}>{analysis.score}/100</span>
        </div>
        <div style={styles.infoCard}>
          <span style={styles.infoIcon}>📅</span>
          <span style={styles.infoLabel}>Analyzed</span>
          <span style={styles.infoValue}>
            {new Date(analysis.submittedAt).toLocaleDateString()}
          </span>
        </div>
        <div style={styles.infoCard}>
          <span style={styles.infoIcon}>🆔</span>
          <span style={styles.infoLabel}>Report ID</span>
          <span style={styles.infoValue}>#{analysis.id}</span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'linear-gradient(135deg, #1e293b, #162032)',
    border: '1px solid #334155',
    borderRadius: '20px',
    padding: '28px',
  },
  header: {
    marginBottom: '20px',
  },
  heading: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '4px',
  },
  filename: {
    fontSize: '13px',
    color: '#64748b',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: '#1e1b4b',
  },
  feedbackBox: {
    background: '#0f172a',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
  },
  feedbackHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  feedbackTitle: {
    fontSize: '16px',
    fontWeight: '700',
  },
  feedbackText: {
    color: '#cbd5e1',
    lineHeight: '1.7',
    fontSize: '14px',
  },
  infoRow: {
    display: 'flex',
    gap: '12px',
  },
  infoCard: {
    flex: 1,
    background: '#0f172a',
    borderRadius: '10px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    border: '1px solid #1e293b',
  },
  infoIcon: {
    fontSize: '20px',
  },
  infoLabel: {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#e2e8f0',
  },
}
