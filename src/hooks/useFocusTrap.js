import { useEffect } from 'react'

const focusable =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/** Traps Tab focus inside `ref`, closes on Escape, locks scroll, and restores focus on unmount. */
export function useFocusTrap(ref, { onEscape } = {}) {
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const previous = document.activeElement
    const first = node.querySelector('[data-autofocus]') ?? node.querySelector(focusable) ?? node
    first.focus({ preventScroll: true })

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onEscape?.()
        return
      }
      if (e.key !== 'Tab') return
      const items = [...node.querySelectorAll(focusable)]
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault()
        lastItem.focus()
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault()
        firstItem.focus()
      }
    }
    node.addEventListener('keydown', onKeyDown)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      node.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      previous?.focus?.({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
