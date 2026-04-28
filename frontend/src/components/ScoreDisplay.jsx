import { C, scoreInfo } from '../theme'

export default function ScoreDisplay({ score, analysis }) {
  // scoreInfo from theme.js — same logic, single source of truth
  const getColor = scoreInfo

  const { fill, text, label } = getColor(score)
  const radius           = 70
  const circumference    = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  // NOTE: sub-scores can be null when the AI truncates its JSON response.
  // We explicitly keep them as null rather than computing a fake estimate,
  // so the UI shows "N/A" instead of a misleading calculated value.
  const sections = [
    { label: 'Summary',      value: analysis?.summaryScore        ?? null, max: 20 },
    { label: 'Skills',       value: analysis?.skillsScore         ?? null, max: 20 },
    { label: 'Experience',   value: analysis?.experienceScore     ?? null, max: 30 },
    { label: 'Formatting',   value: analysis?.formattingScore     ?? null, max: 15 },
    { label: 'Professional', value: analysis?.professionalismScore ?? null, max: 15 },
  ]

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Resume Score</h3>

      {/* Ring */}
      <div style={styles.circleWrap}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#fde68a" strokeWidth="14" />
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke={fill}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 90 90)"
            style={{ transition: 'stroke-dashoffset 1.2s ease', filter: `drop-shadow(0 0 6px ${fill}55)` }}
          />
        </svg>
        <div style={styles.scoreInner}>
          <span style={{ ...styles.scoreNumber, color: text }}>{score}</span>
          <span style={styles.outOf}>/100</span>
        </div>
      </div>

      {/* Badge */}
      <div style={{ ...styles.badge, background: fill + '18', border: `1px solid ${fill}55` }}>
        <span style={{ color: text, fontWeight: '700', fontSize: '14px' }}>{label}</span>
      </div>

      {/* Section bars */}
      <div style={styles.bars}>
        {sections.map(({ label: l, value, max }) => {
          const isNull   = value == null
          const pct      = isNull ? 0 : Math.round((value / max) * 100)
          const barColor = isNull ? '#d1d5db' : getColor(pct).fill
          return (
            <div key={l} style={styles.barRow}>
              <span style={styles.barLabel}>{l}</span>
              <div style={styles.barTrack}>
                {!isNull && <div style={{ ...styles.barFill, width: `${Math.max(4, pct)}%`, background: barColor }} />}
              </div>
              <span style={{ ...styles.barValue, color: barColor }}>
                {isNull ? 'N/A' : `${value}/${max}`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  container:   { background: C.card_light, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '28px', textAlign: 'center', boxShadow: '0 4px 24px rgba(245,158,11,0.10)' },
  heading:     { fontSize: '13px', fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '20px' },
  circleWrap:  { position: 'relative', display: 'inline-block', marginBottom: '16px' },
  scoreInner:  { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'baseline', gap: '2px' },
  scoreNumber: { fontSize: '44px', fontWeight: '900', lineHeight: 1 },
  outOf:       { fontSize: '16px', color: C.muted, fontWeight: '500' },
  badge:       { display: 'inline-block', padding: '6px 20px', borderRadius: '999px', marginBottom: '24px' },
  bars:        { display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' },
  barRow:      { display: 'flex', alignItems: 'center', gap: '10px' },
  barLabel:    { fontSize: '12px', color: C.sub, width: '80px', flexShrink: 0 },
  barTrack:    { flex: 1, height: '6px', background: '#fde68a', borderRadius: '999px', overflow: 'hidden' },
  barFill:     { height: '100%', borderRadius: '999px', transition: 'width 1s ease' },
  barValue:    { fontSize: '11px', fontWeight: '700', width: '36px', textAlign: 'right' },
}
