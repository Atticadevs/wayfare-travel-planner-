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
