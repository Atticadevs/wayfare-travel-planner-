import { useId } from 'react'
import { motion } from 'framer-motion'
import { spring } from '../../lib/motion'
import { cn } from '../../lib/cn'

/** Single-select pill group. Options: [{ value, label, icon? }]. */
export function SegmentedControl({ options, value, onChange, label, className }) {
  const group = useId()
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex rounded-control bg-surface-2 p-1', className)}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
              active ? 'text-text' : 'text-muted hover:text-text',
            )}
          >
            {active && (
              <motion.span
                layoutId={`${group}-thumb`}
                transition={spring}
                className="absolute inset-0 rounded-lg bg-surface shadow-sm dark:border dark:border-border"
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {o.icon && <o.icon size={14} aria-hidden="true" />}
              {o.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
