import { useCallback, useEffect } from 'react'
import { useTripStore } from '../store/useTripStore'

function applyTheme(theme, animate) {
  const root = document.documentElement
  if (animate) {
    root.classList.add('theme-fade')
    setTimeout(() => root.classList.remove('theme-fade'), 300)
  }
  root.classList.toggle('dark', theme === 'dark')
}

/** Keeps the <html> dark class in sync with the saved theme setting ('light' or 'dark'). */
export function useThemeSync() {
  const theme = useTripStore((s) => s.settings.theme)
  useEffect(() => applyTheme(theme, true), [theme])
}

export function useTheme() {
  const theme = useTripStore((s) => s.settings.theme)
  const updateSettings = useTripStore((s) => s.updateSettings)
  const setTheme = useCallback((next) => updateSettings({ theme: next }), [updateSettings])
  const isDark = theme === 'dark'
  const toggle = useCallback(() => setTheme(isDark ? 'light' : 'dark'), [isDark, setTheme])
  return { theme, setTheme, toggle, isDark }
}
