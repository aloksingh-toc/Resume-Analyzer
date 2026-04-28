/**
 * Design tokens — Indigo/Navy theme (2026 AI SaaS standard)
 * Inspired by LinkedIn, Notion AI, Resume.io color palettes.
 *
 * Dark palette (page shell, header, background):
 *   C.bg, C.card_dark, C.border_dark, C.accent, C.accentWarm, C.gradient,
 *   C.text_dark, C.textSub, C.textMuted
 *
 * Light palette (result cards, form panels):
 *   C.card_light, C.surface, C.border, C.text, C.sub, C.muted
 */
export const C = {
  // ── Page / dark shell ────────────────────────────────────────
  bg:          '#060d1a',
  card_dark:   '#0d1629',
  border_dark: '#1a2744',

  // ── Light card surface ────────────────────────────────────────
  card_light:  'linear-gradient(145deg, #ffffff, #f0f4ff)',
  surface:     'linear-gradient(145deg, #f0f4ff, #eef2ff)',
  border:      '#c7d2fe',

  // ── Accent (indigo / violet) ──────────────────────────────────
  accent:      '#6366f1',
  accentWarm:  '#8b5cf6',
  gradient:    'linear-gradient(135deg, #6366f1, #8b5cf6)',

  // ── Text (dark bg) ────────────────────────────────────────────
  text_dark:   '#f1f5f9',
  textSub:     '#94a3b8',
  textMuted:   '#64748b',

  // ── Text (light card bg) ─────────────────────────────────────
  text:        '#0f172a',
  sub:         '#374151',
  muted:       '#6b7280',
}

/**
 * Semantic score colors — used in ScoreDisplay and HistoryList.
 */
export function scoreColor(s) {
  if (s >= 83) return '#16a34a'
  if (s >= 71) return '#059669'
  if (s >= 56) return '#d97706'
  if (s >= 41) return '#dc2626'
  return '#dc2626'
}

/**
 * Full score metadata including label — used in ScoreDisplay.
 */
export function scoreInfo(s) {
  if (s >= 83) return { fill: '#16a34a', text: '#15803d', label: 'Excellent' }
  if (s >= 71) return { fill: '#059669', text: '#047857', label: 'Good' }
  if (s >= 56) return { fill: '#d97706', text: '#b45309', label: 'Average' }
  if (s >= 41) return { fill: '#dc2626', text: '#b91c1c', label: 'Below Average' }
  return { fill: '#dc2626', text: '#b91c1c', label: 'Needs Work' }
}
