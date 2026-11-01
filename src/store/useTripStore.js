import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { STORAGE_KEY, storage } from '../services/storage'

export const SCHEMA_VERSION = 1

export const defaultSettings = {
  theme: 'system',
  baseCurrency: 'USD',
  userName: 'Traveler',
  reducedMotion: false,
}

/** Migration hook: upgrade persisted state from an older schemaVersion. */
function migrate(persisted) {
  // Add `if (fromVersion < N)` steps here as the schema evolves.
  return { ...persisted, schemaVersion: SCHEMA_VERSION }
}

export const useTripStore = create(
  persist(
    (set) => ({
      schemaVersion: SCHEMA_VERSION,
      settings: defaultSettings,
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
    }),
    {
      name: STORAGE_KEY,
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => storage),
      migrate,
      partialize: ({ schemaVersion, settings }) => ({ schemaVersion, settings }),
    },
  ),
)
