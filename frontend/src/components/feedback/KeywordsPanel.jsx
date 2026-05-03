export default function KeywordsPanel({ keywordsFound, keywordsMissing, hasJdMatch }) {
  const hasAny = keywordsFound?.length > 0 || keywordsMissing?.length > 0
  if (!hasAny) return null

  return (
    <div style={styles.wrap}>
      {keywordsFound?.length > 0 && (
        <div style={styles.group}>
          <span style={styles.label}>Found in Resume</span>
          <div style={styles.chips}>
            {keywordsFound.map(kw => <span key={kw} style={styles.found}>{kw}</span>)}
          </div>
        </div>
      )}
      {keywordsMissing?.length > 0 && (
        <div style={styles.group}>
          <span style={styles.label}>
            Missing Keywords{hasJdMatch ? ' (from JD)' : ' (recommended)'}
          </span>
          <div style={styles.chips}>
            {keywordsMissing.map(kw => <span key={kw} style={styles.missing}>{kw}</span>)}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrap:    { background: '#f8faff', border: '1px solid #e0e7ff', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' },
  group:   { minWidth: 0 },
  label:   { display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' },
  chips:   { display: 'flex', flexWrap: 'wrap', gap: '6px', overflow: 'hidden' },
  found:   { padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', whiteSpace: 'nowrap' },
  missing: { padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', whiteSpace: 'nowrap' },
}
