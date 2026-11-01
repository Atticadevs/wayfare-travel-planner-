import { motion } from 'framer-motion'
import { ease } from '../../lib/motion'
import { cn } from '../../lib/cn'

const tones = { primary: 'bg-primary', accent: 'bg-accent', success: 'bg-success', warning: 'bg-warning', danger: 'bg-danger' }

/** Animated bar; `value` is 0-100. */
export function ProgressBar({ value, tone = 'primary', label, className }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-border', className)}
    >
      <motion.div
        className={cn('h-full origin-left rounded-full', tones[tone])}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease }}
      />
    </div>
  )
}
