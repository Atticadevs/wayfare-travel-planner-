import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import { createDemoData } from '../data/demoData'
import { essentials } from '../data/packingTemplates'
import { STORAGE_KEY, storage } from '../services/storage'

export const SCHEMA_VERSION = 1

const defaultSettings = {
  theme: 'system',
  baseCurrency: 'USD',
  userName: 'Traveler',
  reducedMotion: false,
  rateOverrides: {},
}

const emptyEntities = { trips: [], bookings: [], itinerary: [], expenses: [], packing: [], notes: [] }
const entityKeys = Object.keys(emptyEntities)

/** Migration hook: upgrade persisted state from an older schemaVersion. */
function migrate(persisted) {
  // Add `if (fromVersion < N)` steps here as the schema evolves.
  return { ...persisted, schemaVersion: SCHEMA_VERSION }
}

const now = () => new Date().toISOString()

/** Builds add/update/delete actions for one entity list, e.g. addBooking. */
function crud(set, key, name, { timestamps = false } = {}) {
  return {
    [`add${name}`]: (data) => {
      const id = nanoid()
      const stamp = timestamps ? { createdAt: now(), updatedAt: now() } : {}
      set((s) => ({ [key]: [...s[key], { ...data, ...stamp, id }] }))
      return id
    },
    [`update${name}`]: (id, patch) =>
      set((s) => ({
        [key]: s[key].map((item) => (item.id === id ? { ...item, ...patch, ...(timestamps ? { updatedAt: now() } : {}) } : item)),
      })),
    [`delete${name}`]: (id) => set((s) => ({ [key]: s[key].filter((item) => item.id !== id) })),
  }
}

export const useTripStore = create(
  persist(
    (set, get) => ({
      schemaVersion: SCHEMA_VERSION,
      settings: defaultSettings,
      recentConversions: [],
      ...emptyEntities,

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      ...crud(set, 'trips', 'Trip', { timestamps: true }),
      ...crud(set, 'bookings', 'Booking'),
      ...crud(set, 'itinerary', 'ItineraryItem'),
      ...crud(set, 'expenses', 'Expense'),
      ...crud(set, 'packing', 'PackingItem'),
      ...crud(set, 'notes', 'Note', { timestamps: true }),

      /** Re-inserts a deleted record into one of the entity lists (undo). */
      restore: (key, record) => set((s) => ({ [key]: [...s[key], record] })),

      /** Removes a trip and everything attached to it; returns a bundle for undo. */
      removeTrip: (id) => {
        const s = get()
        const bundle = { trip: s.trips.find((t) => t.id === id) }
        entityKeys.filter((k) => k !== 'trips').forEach((k) => {
          bundle[k] = s[k].filter((item) => item.tripId === id)
        })
        set((state) => ({
          trips: state.trips.filter((t) => t.id !== id),
          ...Object.fromEntries(entityKeys.filter((k) => k !== 'trips').map((k) => [k, state[k].filter((item) => item.tripId !== id)])),
        }))
        return bundle
      },

      /** Re-inserts a bundle returned by removeTrip (undo). */
      restoreTrip: (bundle) =>
        set((s) => ({
          trips: [...s.trips, bundle.trip],
          ...Object.fromEntries(entityKeys.filter((k) => k !== 'trips').map((k) => [k, [...s[k], ...bundle[k]]])),
        })),

      /** Copies a trip with a fresh plan: itinerary reset to todo, packing unpacked, no bookings or expenses. */
      duplicateTrip: (id) => {
        const s = get()
        const source = s.trips.find((t) => t.id === id)
        if (!source) return null
        const newId = nanoid()
        const stamp = now()
        set((state) => ({
          trips: [...state.trips, { ...source, id: newId, title: `${source.title} (copy)`, status: 'planned', createdAt: stamp, updatedAt: stamp }],
          itinerary: [...state.itinerary, ...s.itinerary.filter((i) => i.tripId === id).map((i) => ({ ...i, id: nanoid(), tripId: newId, status: 'todo' }))],
          packing: [...state.packing, ...s.packing.filter((p) => p.tripId === id).map((p) => ({ ...p, id: nanoid(), tripId: newId, packed: false }))],
          notes: [...state.notes, ...s.notes.filter((n) => n.tripId === id).map((n) => ({ ...n, id: nanoid(), tripId: newId, createdAt: stamp, updatedAt: stamp }))],
        }))
        return newId
      },

      /** Persists a new order for the given itinerary ids (one day's items). */
      reorderItinerary: (orderedIds) =>
        set((s) => {
          const slots = s.itinerary.filter((i) => orderedIds.includes(i.id)).map((i) => i.order).sort((a, b) => a - b)
          const orderById = Object.fromEntries(orderedIds.map((id, index) => [id, slots[index]]))
          return { itinerary: s.itinerary.map((i) => (i.id in orderById ? { ...i, order: orderById[i.id] } : i)) }
        }),

      /** Adds the starter checklist to a trip, skipping labels already present. */
      addEssentials: (tripId) =>
        set((s) => {
          const existing = new Set(s.packing.filter((p) => p.tripId === tripId).map((p) => p.label.toLowerCase()))
          const added = essentials
            .filter(([label]) => !existing.has(label.toLowerCase()))
            .map(([label, group]) => ({ id: nanoid(), tripId, label, group, packed: false }))
          return { packing: [...s.packing, ...added] }
        }),

      resetPacking: (tripId) =>
        set((s) => ({ packing: s.packing.map((p) => (p.tripId === tripId ? { ...p, packed: false } : p)) })),

      /** Remembers a conversion { amount, from, to }; newest first, no duplicates, max 6. */
      addRecentConversion: (entry) =>
        set((s) => ({
          recentConversions: [
            entry,
            ...s.recentConversions.filter((c) => !(c.amount === entry.amount && c.from === entry.from && c.to === entry.to)),
          ].slice(0, 6),
        })),

      loadDemoData: () => set(createDemoData()),

      /** Replaces all entities and settings (used by import). */
      replaceAll: (snapshot) =>
        set({
          ...Object.fromEntries(entityKeys.map((k) => [k, snapshot[k] ?? []])),
          settings: { ...defaultSettings, ...snapshot.settings },
        }),

      resetAll: () => set({ ...emptyEntities, settings: defaultSettings, recentConversions: [] }),
    }),
    {
      name: STORAGE_KEY,
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => storage),
      migrate,
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        settings: { ...current.settings, ...persisted?.settings },
      }),
      partialize: (s) => ({ schemaVersion: s.schemaVersion, settings: s.settings, recentConversions: s.recentConversions, ...Object.fromEntries(entityKeys.map((k) => [k, s[k]])) }),
    },
  ),
)
