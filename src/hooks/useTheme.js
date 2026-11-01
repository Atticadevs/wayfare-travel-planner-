import { useCallback, useEffect } from 'react'
import { useTripStore } from '../store/useTripStore'

const query = '(prefers-color-scheme: dark)'

function applyTheme(theme, animate) {
  const root = document.documentElement
  const dark = theme === 'dark' || (theme === 'system' && matchMedia(query).matches)
  if (animate) {
    root.classList.add('theme-fade')
    setTimeout(() => root.classList.remove('theme-fade'), 300)
  }
  root.classList.toggle('dark', dark)
}

/** Keeps the <html> dark class in sync with the saved theme setting. */
export function useThemeSync() {
  const theme = useTripStore((s) => s.settings.theme)
  useEffect(() => {
    applyTheme(theme, true)
    if (theme !== 'system') return undefined
    const mq = matchMedia(query)
    const onChange = () => applyTheme('system', true)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])
}

export function useTheme() {
  const theme = useTripStore((s) => s.settings.theme)
  const updateSettings = useTripStore((s) => s.updateSettings)
  const setTheme = useCallback((next) => updateSettings({ theme: next }), [updateSettings])
  const isDark = theme === 'dark' || (theme === 'system' && matchMedia(query).matches)
  const toggle = useCallback(() => setTheme(isDark ? 'light' : 'dark'), [isDark, setTheme])
  return { theme, setTheme, toggle, isDark }
}
