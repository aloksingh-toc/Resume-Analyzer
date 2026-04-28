/**
 * Shared design tokens — single source of truth for the warm amber theme.
 * Import this instead of defining a local `C` object in each component.
 *
 * Dark palette (used in App.jsx header / page background):
 *   C.bg, C.card_dark, C.border_dark, C.accent, C.accentWarm, C.gradient,
 *   C.text_dark, C.textSub, C.textMuted
 *
 * Light palette (used in cards / form panels):
 *   C.card_light, C.surface, C.border, C.text, C.sub, C.muted
 */
export const C = {
  // ── Page / dark shell ────────────────────────────────────────
  bg:          '#080808',
  card_dark:   '#1a0505',
  border_dark: '#2d0808',

  // ── Light card surface ────────────────────────────────────────
  card_light:  'linear-gradient(145deg, #fffef8, #fef9c3)',
  surface:     'linear-gradient(145deg, #fef9c3, #fef3c7)',
  border:      '#f0d070',

  // ── Accent (amber / orange) ───────────────────────────────────
  accent:      '#f59e0b',
  accentWarm:  '#ea580c',
  gradient:    'linear-gradient(135deg, #f59e0b, #ea580c)',

  // ── Text (dark bg) ────────────────────────────────────────────
  text_dark:   '#fef3e2',
  textSub:     '#c4935a',
  textMuted:   '#8a5a5a',

  // ── Text (light card bg) ─────────────────────────────────────
  text:        '#1c1917',
  sub:         '#78350f',
  muted:       '#a16207',
}

/**
 * Semantic score colors — used in ScoreDisplay and HistoryList.
 * Returns fill color based on a 0–100 score.
 */
export function scoreColor(s) {
  if (s >= 83) return '#16a34a'
  if (s >= 71) return '#d97706'
  if (s >= 56) return '#ea580c'
  if (s >= 41) return '#dc2626'
  return '#dc2626'
}

/**
 * Full score metadata including label — used in ScoreDisplay.
 */
export function scoreInfo(s) {
  if (s >= 83) return { fill: '#16a34a', text: '#15803d', label: 'Excellent' }
  if (s >= 71) return { fill: '#d97706', text: '#b45309', label: 'Good' }
  if (s >= 56) return { fill: '#ea580c', text: '#c2410c', label: 'Average' }
  if (s >= 41) return { fill: '#dc2626', text: '#b91c1c', label: 'Below Average' }
  return { fill: '#dc2626', text: '#b91c1c', label: 'Needs Work' }
}
