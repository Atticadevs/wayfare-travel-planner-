import { create } from 'zustand'
import { nanoid } from 'nanoid'

const DEFAULT_DURATION = 5000

export const useToastStore = create((set) => ({
  toasts: [],
  push: ({ message, actionLabel, onAction, duration = DEFAULT_DURATION }) => {
    const id = nanoid(8)
    set((s) => ({ toasts: [...s.toasts, { id, message, actionLabel, onAction, duration }] }))
    return id
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = (message, options) => useToastStore.getState().push({ message, ...options })
