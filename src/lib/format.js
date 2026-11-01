import { parseDate } from './dates'

export function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

export function formatMoney(amount, currency, { compact = false } = {}) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: compact || Math.abs(amount) >= 1000 ? 0 : 2,
    notation: compact ? 'compact' : 'standard',
  }).format(amount)
}

export function formatDate(iso, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return new Intl.DateTimeFormat(undefined, options).format(typeof iso === 'string' ? parseDate(iso) : iso)
}

export function formatDateRange(startIso, endIso) {
  const start = parseDate(startIso)
  const end = parseDate(endIso)
  const sameYear = start.getFullYear() === end.getFullYear()
  const startText = formatDate(start, sameYear ? { day: 'numeric', month: 'short' } : undefined)
  return `${startText} – ${formatDate(end)}`
}

/** Flag emoji from an ISO 3166 alpha-2 code; empty string when the code is invalid. */
export function flagEmoji(code) {
  if (!/^[A-Za-z]{2}$/.test(code || '')) return ''
  return [...code.toUpperCase()].map((c) => String.fromCodePoint(127397 + c.charCodeAt(0))).join('')
}
