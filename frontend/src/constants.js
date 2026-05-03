/** Maximum resume upload size shown to the user. Must match ResumeFileValidator.MAX_FILE_BYTES. */
export const MAX_FILE_SIZE_MB   = 5
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

/** Number of free analyses a guest gets. Must match FreeAnalysisTracker.FREE_LIMIT. */
export const FREE_ANALYSIS_LIMIT = 3

/** OAuth redirect helper — keeps env-var access out of UI components. */
export const getOAuthUrl = (provider) =>
  `${import.meta.env.VITE_API_URL || ''}/oauth2/authorization/${provider}`
