/**
 * Design tokens — Indigo/Navy theme (2026 AI SaaS standard)
 *
 * Dark palette (page shell, header, background):
 *   dark.bg, dark.card, dark.border, dark.text, dark.textSub, dark.textMuted
 *
 * Light palette (result cards, form panels):
 *   light.card, light.surface, light.border, light.text, light.sub, light.muted
 *
 * Accent:  accent, accentWarm, gradient
 * Semantic: scoreColor(n), statusColor(n), scoreInfo(n)
 */

// ── Raw tokens ────────────────────────────────────────────────────────────────
export const C = {
  // Page / dark shell
  bg:          '#060d1a',
  card_dark:   '#0d1629',
  border_dark: '#1a2744',

  // Light card surface
  card_light:  'linear-gradient(145deg, #ffffff, #f0f4ff)',
  surface:     'linear-gradient(145deg, #f0f4ff, #eef2ff)',
  border:      '#c7d2fe',

  // Accent (indigo / violet)
  accent:      '#6366f1',
  accentWarm:  '#8b5cf6',
  gradient:    'linear-gradient(135deg, #6366f1, #8b5cf6)',

  // Text on dark bg
  text_dark:   '#f1f5f9',
  textSub:     '#94a3b8',
  textMuted:   '#64748b',

  // Text on light card bg
  text:        '#0f172a',
  sub:         '#374151',
  muted:       '#6b7280',

  // Semantic surfaces (used in App errorBox etc.)
  errorSurface: '#1e0a2e',
  errorBorder:  '#7c3aed',
  errorText:    '#ddd6fe',
}

// ── Pre-composed alias groups (import these instead of re-aliasing locally) ───

/** Tokens for components that sit on the dark navy shell (App, HowItWorks, TemplateGallery). */
export const darkTokens = {
  bg:        C.bg,
  card:      C.card_dark,
  border:    C.border_dark,
  accent:    C.accent,
  accentWarm:C.accentWarm,
  gradient:  C.gradient,
  text:      C.text_dark,
  textSub:   C.textSub,
  textMuted: C.textMuted,
}

/** Tokens for components that sit on a light card surface (UploadSection, LoginPage, FeedbackDisplay). */
export const lightTokens = {
  card:    C.card_light,
  surface: C.surface,
  border:  C.border,
  accent:  C.accent,
  gradient:C.gradient,
  text:    C.text,
  sub:     C.sub,
  muted:   C.muted,
}

// ── Score colour functions ─────────────────────────────────────────────────────

/**
 * Returns a colour for a 0-100 overall resume score.
 * Used in ScoreDisplay and HistoryList.
 */
export function scoreColor(s) {
  if (s >= 83) return '#16a34a'
  if (s >= 71) return '#059669'
  if (s >= 56) return '#d97706'
  return '#dc2626'
}

/**
 * Returns a colour for any 0-100 percentage (ATS score, JD match %).
 * Single source of truth — replaces the old local statusColor in FeedbackDisplay.
 */
export function statusColor(s) {
  if (s >= 75) return '#16a34a'
  if (s >= 45) return '#d97706'
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
