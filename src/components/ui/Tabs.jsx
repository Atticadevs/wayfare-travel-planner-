import { useId } from 'react'
import { motion } from 'framer-motion'
import { spring } from '../../lib/motion'
import { cn } from '../../lib/cn'

/** Underline tabs; the underline slides between tabs via a shared layoutId. */
export function Tabs({ tabs, value, onChange, label = 'Sections', className }) {
  const group = useId()
  const move = (e, index) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = tabs[(index + step + tabs.length) % tabs.length]
    onChange(next.id)
    document.getElementById(`${group}-${next.id}`)?.focus()
  }
  return (
    <div role="tablist" aria-label={label} className={cn('flex gap-1 overflow-x-auto overflow-y-hidden border-b border-border', className)}>
      {tabs.map((tab, i) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            id={`${group}-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => move(e, i)}
            className={cn(
              'relative flex shrink-0 items-center gap-2 px-4 py-3 font-heading text-sm font-semibold transition-colors focus-visible:ring-inset focus-visible:ring-offset-0',
              active ? 'text-primary' : 'text-muted hover:text-text',
            )}
          >
            {tab.icon && <tab.icon size={16} aria-hidden="true" />}
            {tab.label}
            {active && (
              <motion.span
                layoutId={`${group}-underline`}
                transition={spring}
                className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
