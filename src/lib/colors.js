/** Preset cover gradients (no remote images). Keys are stored in trip.coverImage. */
export const coverGradients = {
  sunset: 'linear-gradient(135deg, #ff9a5c 0%, #ff5e7e 100%)',
  ocean: 'linear-gradient(135deg, #38bdf8 0%, #3b5bdb 100%)',
  forest: 'linear-gradient(135deg, #34d399 0%, #0f766e 100%)',
  lavender: 'linear-gradient(135deg, #c4b5fd 0%, #6366f1 100%)',
  rose: 'linear-gradient(135deg, #fda4af 0%, #be185d 100%)',
  sand: 'linear-gradient(135deg, #fde68a 0%, #d97706 100%)',
  night: 'linear-gradient(135deg, #4f46e5 0%, #0f172a 100%)',
  mint: 'linear-gradient(135deg, #a7f3d0 0%, #0891b2 100%)',
}

/** Resolves a trip cover (preset key or uploaded data URL) to a CSS background value. */
export function coverBackground(cover) {
  if (cover?.startsWith('data:')) return `center / cover no-repeat url(${cover})`
  return coverGradients[cover] ?? coverGradients.ocean
}

const notePalettes = [
  'bg-amber-100 dark:bg-amber-400/15',
  'bg-orange-100 dark:bg-orange-400/15',
  'bg-rose-100 dark:bg-rose-400/15',
  'bg-emerald-100 dark:bg-emerald-400/15',
  'bg-sky-100 dark:bg-sky-400/15',
]

const hashId = (id) => [...id].reduce((sum, c) => sum + c.charCodeAt(0), 0)

/** Stable sticky-note colour classes derived from a note id. */
export const notePalette = (id) => notePalettes[hashId(id) % notePalettes.length]

const tripColors = ['#6366f1', '#f97316', '#0ea5e9', '#10b981', '#ec4899', '#eab308', '#8b5cf6']

/** Stable accent colour per trip (calendar bars, timelines). Readable on light and dark. */
export const tripColor = (id) => tripColors[hashId(id) % tripColors.length]
