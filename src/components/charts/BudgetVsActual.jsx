import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { formatMoney } from '../../lib/format'
import { chartViewport, ease } from '../../lib/motion'
import { gaugeTone } from './BudgetGauge'

// The track represents 100% of budget; the axis runs to 130% so overspend stays visible.
const AXIS_MAX = 1.3
const MARKER = (1 / AXIS_MAX) * 100

/** Bullet-style bars per trip: thin spend bar over a wider budget track, marker at 100%. */
export function BudgetVsActual({ rows, currency }) {
  const ref = useRef(null)
  const inView = useInView(ref, chartViewport)

  const summary = `Budget versus actual per trip: ${rows
    .map(({ trip, budget, spent }) => `${trip.title} ${budget > 0 ? Math.round((spent / budget) * 100) : 0}% of ${formatMoney(budget, currency)}`)
    .join('; ')}.`

  return (
    <div ref={ref} role="group" aria-label={summary}>
      <ul className="space-y-4">
        {rows.map(({ trip, budget, spent }, index) => {
          const ratio = budget > 0 ? spent / budget : 0
          return (
            <li key={trip.id}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
                <Link to={`/trips/${trip.id}`} className="truncate text-sm font-semibold hover:underline">
                  {trip.title}
                </Link>
                <span className="shrink-0 tabular-nums text-muted">
                  <span className="font-semibold text-text">{formatMoney(spent, currency, { compact: true })}</span> / {formatMoney(budget, currency, { compact: true })} · {Math.round(ratio * 100)}%
                </span>
              </div>
              <div className="relative h-5">
                <div className="absolute inset-y-0 left-0 rounded-full bg-blue" style={{ width: `${MARKER}%` }} />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: inView ? 1 : 0 }}
                  transition={{ duration: 0.7, ease, delay: index * 0.06 }}
                  style={{
                    originX: 0,
                    width: `${(Math.min(ratio, AXIS_MAX) / AXIS_MAX) * 100}%`,
                    background: `rgb(var(--${gaugeTone(ratio)}))`,
                  }}
                  className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full"
                />
                <div aria-hidden="true" className="absolute inset-y-[-2px] w-0.5 rounded bg-text" style={{ left: `${MARKER}%` }} />
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 text-xs text-muted">The vertical line marks 100% of each trip’s budget.</p>
    </div>
  )
}
