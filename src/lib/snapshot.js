import { SCHEMA_VERSION } from '../store/useTripStore'

const ENTITY_KEYS = ['trips', 'bookings', 'itinerary', 'expenses', 'packing', 'notes']

/** Plain-data copy of everything worth exporting. */
export function buildSnapshot(state) {
  return {
    app: 'wayfare',
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    settings: state.settings,
    ...Object.fromEntries(ENTITY_KEYS.map((k) => [k, state[k]])),
  }
}

const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v)
const isIsoDate = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)

/**
 * Validates an imported file. Returns { ok: true, snapshot, counts } or { ok: false, error }.
 * Checks shape and the fields the app depends on, and that records point at existing trips.
 */
export function validateSnapshot(data) {
  if (!isObject(data)) return { ok: false, error: 'This file is not a Wayfare export.' }
  if (data.app !== 'wayfare') return { ok: false, error: 'This file was not exported from Wayfare.' }
  if (typeof data.schemaVersion !== 'number') return { ok: false, error: 'The file has no schema version.' }
  if (data.schemaVersion > SCHEMA_VERSION) return { ok: false, error: 'This export is from a newer version of Wayfare.' }

  for (const key of ENTITY_KEYS) {
    if (!Array.isArray(data[key])) return { ok: false, error: `Missing or invalid “${key}” list.` }
    if (!data[key].every((item) => isObject(item) && typeof item.id === 'string')) return { ok: false, error: `Some “${key}” records are invalid.` }
  }

  const badTrip = data.trips.find(
    (t) => typeof t.title !== 'string' || !isIsoDate(t.startDate) || !isIsoDate(t.endDate) || !isObject(t.budget) || typeof t.budget.amount !== 'number' || typeof t.budget.currency !== 'string',
  )
  if (badTrip) return { ok: false, error: 'A trip in the file is missing required details.' }

  const tripIds = new Set(data.trips.map((t) => t.id))
  for (const key of ENTITY_KEYS.filter((k) => k !== 'trips')) {
    if (data[key].some((item) => !tripIds.has(item.tripId))) return { ok: false, error: `Some “${key}” records belong to a trip that is not in the file.` }
  }

  const counts = Object.fromEntries(ENTITY_KEYS.map((k) => [k, data[k].length]))
  return { ok: true, snapshot: data, counts }
}
