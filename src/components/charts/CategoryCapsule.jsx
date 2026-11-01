import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { expenseCategories } from '../../lib/categories'
import { formatMoney } from '../../lib/format'
import { chartViewport, ease } from '../../lib/motion'
import { cn } from '../../lib/cn'

/**
 * Stacked capsule bar plus a ranked list. `totals` maps expense category to an amount.
 * Hovering or focusing a list row highlights its segment.
 */
export function CategoryCapsule({ totals, currency }) {
  const ref = useRef(null)
  const inView = useInView(ref, chartViewport)
  const [active, setActive] = useState(null)

  const rows = Object.entries(totals)
    .filter(([, amount]) => amount > 0)
    .map(([key, amount]) => ({ key, amount, ...expenseCategories[key] }))
    .sort((a, b) => b.amount - a.amount)
  const total = rows.reduce((sum, r) => sum + r.amount, 0)
  const max = rows[0]?.amount ?? 1

  if (rows.length === 0) return <p className="text-sm text-muted">No spending yet.</p>

  const summary = `Spending by category: ${rows.map((r) => `${r.label} ${Math.round((r.amount / total) * 100)}%`).join(', ')}.`

  return (
    <div ref={ref}>
      <motion.div
        role="img"
        aria-label={summary}
        tabIndex={0}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 0.7, ease }}
        style={{ originX: 0 }}
        className="flex h-4 gap-0.5 overflow-hidden rounded-full"
      >
        {rows.map((r) => (
          <div
            key={r.key}
            style={{ width: `${(r.amount / total) * 100}%`, background: `rgb(var(--${r.color}))` }}
            className={cn('h-full transition-opacity', active && active !== r.key && 'opacity-30')}
          />
        ))}
      </motion.div>

      <ul className="mt-5 space-y-3">
        {rows.map((r) => (
          <li
            key={r.key}
            tabIndex={0}
            onMouseEnter={() => setActive(r.key)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(r.key)}
            onBlur={() => setActive(null)}
            className={cn('rounded-lg transition-opacity', active && active !== r.key && 'opacity-50')}
          >
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-semibold">
                <r.icon size={14} aria-hidden="true" style={{ color: `rgb(var(--${r.color}))` }} />
                {r.label}
              </span>
              <span className="tabular-nums">
                {formatMoney(r.amount, currency)} <span className="text-muted">· {Math.round((r.amount / total) * 100)}%</span>
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-border">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: inView ? r.amount / max : 0 }}
                transition={{ duration: 0.6, ease }}
                style={{ originX: 0, background: `rgb(var(--${r.color}))` }}
                className="h-full w-full rounded-full"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
