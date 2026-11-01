import { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { chartViewport, ease, popover } from '../../lib/motion'
import { cn } from '../../lib/cn'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Twelve rounded bars, one per month. `data` is [{ month, pct, done, total }].
 * The current month uses the accent colour; hover or focus shows a floating label.
 */
export function MonthlyBars({ data, currentMonth, year }) {
  const ref = useRef(null)
  const inView = useInView(ref, chartViewport)
  const [active, setActive] = useState(null)

  const summary = `Itinerary completion by month for ${year}: ${data
    .filter((d) => d.total > 0)
    .map((d) => `${months[d.month]} ${d.pct}%`)
    .join(', ') || 'no itinerary items yet'}.`

  return (
    <div ref={ref} role="group" aria-label={summary} className="flex flex-1 flex-col">
      <div className="flex min-h-56 flex-1 items-end gap-1.5 sm:gap-2">
        {data.map((d) => {
          const isCurrent = d.month === currentMonth
          return (
            <div key={d.month} className="relative flex h-full flex-1 flex-col justify-end">
              <AnimatePresence>
                {active === d.month && (
                  <div className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full">
                    <motion.div
                      {...popover}
                      role="tooltip"
                      className="whitespace-nowrap rounded-lg bg-text px-2.5 py-1.5 text-xs font-semibold text-bg shadow-lift"
                    >
                      {months[d.month]}: {d.total ? `${d.pct}% · ${d.done} of ${d.total} done` : 'nothing planned'}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
              <button
                type="button"
                aria-label={`${months[d.month]}: ${d.total ? `${d.pct}% complete, ${d.done} of ${d.total} items` : 'nothing planned'}`}
                onMouseEnter={() => setActive(d.month)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(d.month)}
                onBlur={() => setActive(null)}
                className="flex h-full w-full items-end rounded-full"
              >
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: inView ? 1 : 0 }}
                  transition={{ duration: 0.6, ease, delay: d.month * 0.03 }}
                  style={{ originY: 1, height: `${Math.max(d.pct, 6)}%` }}
                  className={cn(
                    'w-full rounded-full transition-colors',
                    d.total === 0 ? 'bg-border' : isCurrent ? 'bg-accent' : 'bg-primary/35 hover:bg-primary/60',
                  )}
                />
              </button>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-1.5 sm:gap-2" aria-hidden="true">
        {months.map((m, i) => (
          <span key={m} className={cn('flex-1 text-center text-[10px] font-semibold', i === currentMonth ? 'text-text' : 'text-muted')}>
            {m}
          </span>
        ))}
      </div>
    </div>
  )
}
