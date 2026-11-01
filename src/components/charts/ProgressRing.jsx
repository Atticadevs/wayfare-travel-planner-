import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { chartViewport, ease } from '../../lib/motion'
import { cn } from '../../lib/cn'

const tones = { primary: 'primary', accent: 'accent', success: 'success', warning: 'warning', danger: 'danger' }

/** Small progress ring with the percentage in the centre. `value` is 0-100. */
export function ProgressRing({ value, size = 72, stroke = 8, tone = 'primary', label, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, chartViewport)
  const pct = Math.max(0, Math.min(100, value))
  const radius = (size - stroke) / 2
  const summary = `${label ?? 'Progress'}: ${Math.round(pct)}%`

  return (
    <div ref={ref} role="img" aria-label={summary} tabIndex={0} className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgb(var(--border))" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`rgb(var(--${tones[tone]}))`}
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView ? pct / 100 : 0 }}
          transition={{ duration: 0.8, ease }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-heading text-sm font-extrabold">{Math.round(pct)}%</span>
    </div>
  )
}
