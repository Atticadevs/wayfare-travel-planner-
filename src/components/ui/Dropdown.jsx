import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { popover } from '../../lib/motion'
import { cn } from '../../lib/cn'

/**
 * Menu button. `trigger` renders the toggle (receives props to spread),
 * `items` is [{ label, icon?, onSelect, danger? }].
 */
export function Dropdown({ trigger, items, label }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const menu = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    menu.current?.querySelector('[role="menuitem"]')?.focus()
    const onDown = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const onKeyDown = (e) => {
    const nodes = [...menu.current.querySelectorAll('[role="menuitem"]')]
    const i = nodes.indexOf(document.activeElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      nodes[(i + 1) % nodes.length].focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      nodes[(i - 1 + nodes.length) % nodes.length].focus()
    } else if (e.key === 'Escape') {
      setOpen(false)
      root.current.querySelector('[aria-haspopup]')?.focus()
    }
  }

  return (
    <div ref={root} className="relative">
      {trigger({
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-label': label,
        onClick: () => setOpen((o) => !o),
      })}
      <AnimatePresence>
        {open && (
          <motion.div
            {...popover}
            ref={menu}
            role="menu"
            aria-label={label}
            onKeyDown={onKeyDown}
            className="absolute right-0 z-30 mt-2 min-w-44 rounded-control border border-border bg-surface p-1 shadow-lift"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  item.onSelect()
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-primary/10 focus-visible:bg-primary/10',
                  item.danger && 'text-danger-fg',
                )}
              >
                {item.icon && <item.icon size={14} aria-hidden="true" />}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
