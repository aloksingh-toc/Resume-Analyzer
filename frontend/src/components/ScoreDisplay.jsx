export default function ScoreDisplay({ score, analysis }) {
  const getColor = (s) => {
    if (s >= 83) return { fill: '#22c55e', text: '#4ade80', label: 'Excellent' }
    if (s >= 71) return { fill: '#6366f1', text: '#818cf8', label: 'Good' }
    if (s >= 56) return { fill: '#f59e0b', text: '#fbbf24', label: 'Average' }
    if (s >= 41) return { fill: '#f97316', text: '#fb923c', label: 'Below Average' }
    return { fill: '#ef4444', text: '#f87171', label: 'Needs Work' }
  }

  const { fill, text, label } = getColor(score)

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  // Use real section scores from AI, fallback to calculated
  const sections = [
    {
      label: 'Summary',
      value: analysis?.summaryScore ?? Math.round(score * 0.20),
      max: 20,
    },
    {
      label: 'Skills',
      value: analysis?.skillsScore ?? Math.round(score * 0.20),
      max: 20,
    },
    {
      label: 'Experience',
      value: analysis?.experienceScore ?? Math.round(score * 0.30),
      max: 30,
    },
    {
      label: 'Formatting',
      value: analysis?.formattingScore ?? Math.round(score * 0.15),
      max: 15,
    },
    {
      label: 'Professional',
      value: analysis?.professionalismScore ?? Math.round(score * 0.15),
      max: 15,
    },
  ]

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Resume Score</h3>

      {/* Circular Score */}
      <div style={styles.circleWrap}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#1e293b" strokeWidth="14" />
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke={fill}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 90 90)"
            style={{ transition: 'stroke-dashoffset 1.2s ease' }}
          />
        </svg>
        <div style={styles.scoreInner}>
          <span style={{ ...styles.scoreNumber, color: text }}>{score}</span>
          <span style={styles.outOf}>/100</span>
        </div>
      </div>

      {/* Label Badge */}
      <div style={{ ...styles.badge, background: fill + '22', border: `1px solid ${fill}55` }}>
        <span style={{ color: text, fontWeight: '700', fontSize: '14px' }}>{label}</span>
      </div>

      {/* Section Scores */}
      <div style={styles.bars}>
        {sections.map(({ label: l, value, max }) => {
          const pct = Math.round((value / max) * 100)
          const barColor = getColor(pct).fill
          return (
            <div key={l} style={styles.barRow}>
              <span style={styles.barLabel}>{l}</span>
              <div style={styles.barTrack}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${Math.max(4, pct)}%`,
                    background: barColor,
                  }}
                />
              </div>
              <span style={{ ...styles.barValue, color: barColor }}>
                {value}/{max}
              </span>
            </div>
          )
        })}
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
    textAlign: 'center',
  },
  heading: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '20px',
  },
  circleWrap: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '16px',
  },
  scoreInner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'baseline',
    gap: '2px',
  },
  scoreNumber: {
    fontSize: '42px',
    fontWeight: '800',
    lineHeight: 1,
  },
  outOf: {
    fontSize: '16px',
    color: '#64748b',
    fontWeight: '500',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 18px',
    borderRadius: '999px',
    marginBottom: '24px',
  },
  bars: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    textAlign: 'left',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  barLabel: {
    fontSize: '12px',
    color: '#94a3b8',
    width: '78px',
    flexShrink: 0,
  },
  barTrack: {
    flex: 1,
    height: '6px',
    background: '#1e293b',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width 1s ease',
  },
  barValue: {
    fontSize: '11px',
    fontWeight: '600',
    width: '36px',
    textAlign: 'right',
  },
}
