export default function HistoryList({ history, onSelect }) {
  if (!history || history.length === 0) {
    return (
      <div style={styles.empty}>
        <span style={{ fontSize: '32px' }}>📂</span>
        <p>No past analyses yet.</p>
      </div>
    )
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#f59e0b'
    if (score >= 40) return '#f97316'
    return '#ef4444'
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>📜 Analysis History</h3>
      <div style={styles.list}>
        {history.map((item) => (
          <div
            key={item.id}
            style={styles.card}
            onClick={() => onSelect(item)}
            onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
            onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
          >
            <div style={styles.cardLeft}>
              <span style={{ fontSize: '20px' }}>📄</span>
              <div>
                <p style={styles.cardName}>{item.filename}</p>
                <p style={styles.cardDate}>
                  {new Date(item.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div
              style={{
                ...styles.scoreBadge,
                background: getScoreColor(item.score) + '22',
                border: `1px solid ${getScoreColor(item.score)}55`,
                color: getScoreColor(item.score),
              }}
            >
              {item.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'linear-gradient(135deg, #1e293b, #162032)',
    border: '1px solid #334155',
    borderRadius: '20px',
    padding: '24px',
  },
  heading: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '16px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  cardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  cardName: {
    color: '#e2e8f0',
    fontWeight: '500',
    fontSize: '14px',
    marginBottom: '2px',
  },
  cardDate: {
    color: '#64748b',
    fontSize: '12px',
  },
  scoreBadge: {
    padding: '4px 12px',
    borderRadius: '999px',
    fontWeight: '700',
    fontSize: '14px',
  },
  empty: {
    textAlign: 'center',
    color: '#64748b',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #1e293b, #162032)',
    border: '1px solid #334155',
    borderRadius: '20px',
  },
}
