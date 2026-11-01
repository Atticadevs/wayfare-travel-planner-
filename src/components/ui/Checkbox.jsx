import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

/** Animated checkbox: the check path draws in over 200ms. */
export function Checkbox({ checked, onChange, label, className, ...props }) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-3', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
        {...props}
      />
      <span
        aria-hidden="true"
        className={cn(
          'grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg',
          checked ? 'border-primary bg-primary' : 'border-border bg-surface',
        )}
      >
        <svg viewBox="0 0 16 16" className="h-3 w-3 text-on-primary">
          <motion.path
            d="M3 8.5 6.5 12 13 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </svg>
      </span>
      {label && <span className="text-sm">{label}</span>}
    </label>
  )
}
