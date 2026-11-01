import { motion } from 'framer-motion'
import { spring } from '../../lib/motion'
import { cn } from '../../lib/cn'

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors',
        checked ? 'justify-end bg-primary' : 'justify-start bg-border',
      )}
    >
      <motion.span layout transition={spring} className="h-5 w-5 rounded-full bg-surface shadow-sm" />
    </button>
  )
}
