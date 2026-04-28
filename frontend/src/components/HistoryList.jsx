import { C, scoreColor } from '../theme'

export default function HistoryList({ history, onSelect, hasMore, onLoadMore, loading }) {
  if (!history || history.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={{ color: C.muted, fontSize: '15px', fontStyle: 'italic' }}>No analyses yet.</p>
        <p style={{ color: C.muted, fontSize: '13px', marginTop: '6px' }}>Upload a resume to get started.</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Analysis History</h3>
      <div style={styles.list}>
        {history.map((item) => (
          <div
            key={item.id}
            style={styles.card}
            onClick={() => onSelect(item)}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef3c7'; e.currentTarget.style.borderColor = '#e0b030' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fef9c3'; e.currentTarget.style.borderColor = '#f0d070' }}
          >
            <div style={styles.cardLeft}>
              <div style={styles.pdfBadge}>PDF</div>
              <div>
                <p style={styles.cardName}>{item.filename}</p>
                <p style={styles.cardDate}>{new Date(item.submittedAt).toLocaleString()}</p>
              </div>
            </div>
            <div style={{ ...styles.scoreBadge, background: scoreColor(item.score) + '18', border: `1px solid ${scoreColor(item.score)}44`, color: scoreColor(item.score) }}>
              {item.score}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loading}
          style={{ ...styles.loadMoreBtn, ...(loading ? styles.loadMoreDisabled : {}) }}
        >
          {loading ? 'Loading…' : 'Load More'}
        </button>
      )}
    </div>
  )
}

const styles = {
  container:       { background: C.card_light, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '24px', boxShadow: '0 4px 24px rgba(245,158,11,0.10)' },
  heading:         { fontSize: '17px', fontWeight: '700', color: C.text, marginBottom: '16px', fontStyle: 'italic' },
  list:            { display: 'flex', flexDirection: 'column', gap: '8px' },
  card:            { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#fef9c3', border: `1px solid ${C.border}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' },
  cardLeft:        { display: 'flex', alignItems: 'center', gap: '12px' },
  pdfBadge:        { fontSize: '10px', fontWeight: '700', color: '#d97706', background: '#fef3c7', border: '1px solid #f0d070', padding: '3px 7px', borderRadius: '5px' },
  cardName:        { color: C.text, fontWeight: '500', fontSize: '14px', marginBottom: '2px' },
  cardDate:        { color: C.muted, fontSize: '12px' },
  scoreBadge:      { padding: '4px 13px', borderRadius: '999px', fontWeight: '800', fontSize: '14px', fontStyle: 'italic' },
  empty:           { textAlign: 'center', padding: '48px 32px', background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', boxShadow: '0 4px 24px rgba(245,158,11,0.10)' },
  loadMoreBtn:     { marginTop: '14px', width: '100%', padding: '10px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '8px', color: C.muted, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' },
  loadMoreDisabled:{ opacity: 0.45, cursor: 'not-allowed' },
}
