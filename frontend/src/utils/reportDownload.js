import { scoreColor } from '../theme'

const SECTIONS = [
  { key: 'summaryFeedback',    label: 'Summary',        scoreKey: 'summaryScore',    max: 20, color: '#6366f1' },
  { key: 'skillsFeedback',     label: 'Skills',         scoreKey: 'skillsScore',     max: 20, color: '#8b5cf6' },
  { key: 'experienceFeedback', label: 'Experience',     scoreKey: 'experienceScore', max: 30, color: '#3b82f6' },
  { key: 'formattingFeedback', label: 'Formatting',     scoreKey: 'formattingScore', max: 15, color: '#0891b2' },
  { key: 'overallFeedback',    label: 'Overall Action', scoreKey: null,              max: null, color: '#7c3aed' },
]

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildHtml(analysis) {
  const fill  = scoreColor(analysis.score)
  const rows  = SECTIONS.map(s => `
    <div style="margin:20px 0;padding:16px 20px;border-left:4px solid ${s.color};background:#f0f4ff;border-radius:0 8px 8px 0">
      <h3 style="color:#1e1b4b;margin:0 0 8px;font-size:15px">
        ${escapeHtml(s.label)}${s.scoreKey && analysis[s.scoreKey] != null ? ` — ${analysis[s.scoreKey]}/${s.max}` : ''}
      </h3>
      <p style="color:#374151;line-height:1.7;margin:0;font-size:14px">
        ${escapeHtml(analysis[s.key]) || 'No feedback available.'}
      </p>
    </div>`).join('')

  return `<!DOCTYPE html>
<html>
<head>
  <title>Resume Analysis — ${escapeHtml(analysis.filename)}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 740px; margin: 0 auto;
           padding: 48px 32px; color: #1c1917; background: #f8faff; }
    h1   { font-size: 26px; color: #4338ca; border-bottom: 2px solid #6366f1;
           padding-bottom: 12px; margin-bottom: 4px; }
    .score { font-size: 72px; font-weight: 900; color: ${fill}; line-height: 1; }
    .meta  { color: #78716c; font-size: 13px; margin-bottom: 32px; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <h1>Resume Analysis Report</h1>
  <p class="meta">
    File: <strong>${escapeHtml(analysis.filename)}</strong>
    &nbsp;·&nbsp; Analyzed: ${new Date(analysis.submittedAt).toLocaleString()}
    &nbsp;·&nbsp; Report #${analysis.id}
  </p>
  <div style="text-align:center;margin:32px 0 24px">
    <div class="score">${analysis.score}</div>
    <p style="color:#78716c;margin:4px 0 0">/100 overall score</p>
  </div>
  ${rows}
</body>
</html>`
}

/**
 * Opens the analysis report in a new window and triggers the browser print dialog.
 * Extracted from FeedbackDisplay so the component stays presentational.
 */
export function downloadReport(analysis) {
  const w = window.open('', '_blank', 'width=820,height=700')
  w.document.write(buildHtml(analysis))
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 400)
}
