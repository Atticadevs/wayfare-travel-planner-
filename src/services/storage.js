// Thin repository layer over localStorage. Nothing else in the app touches
// localStorage. To move to a backend, replace the implementation of this
// module (and keep the same getItem / setItem / removeItem contract).

export const STORAGE_KEY = 'wayfare:v1'

let corrupted = false

function safe(fn, fallback) {
  try {
    return fn()
  } catch {
    return fallback
  }
}

export const storage = {
  getItem(name) {
    const raw = safe(() => localStorage.getItem(name), null)
    if (raw === null) return null
    try {
      JSON.parse(raw)
    } catch {
      corrupted = true
      return null
    }
    return raw
  },
  setItem(name, value) {
    safe(() => localStorage.setItem(name, value))
  },
  removeItem(name) {
    safe(() => localStorage.removeItem(name))
  },
}

/** True when stored data could not be parsed at startup. */
export const wasCorrupted = () => corrupted

export function clearAll() {
  corrupted = false
  storage.removeItem(STORAGE_KEY)
}
