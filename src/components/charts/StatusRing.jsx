import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Ban, CalendarClock, CircleAlert, CircleCheck } from 'lucide-react'
import { chartViewport, ease } from '../../lib/motion'
import { cn } from '../../lib/cn'

const SIZE = 150
const STROKE = 14
const RADIUS = (SIZE - STROKE * 1.6) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP = 6

const segments = [
  { key: 'completed', label: 'Completed', color: 'primary', icon: CircleCheck, to: '/trips?status=completed' },
  { key: 'left', label: 'Left', color: 'info', icon: CalendarClock, to: '/trips?status=left' },
  { key: 'missed', label: 'Missed', color: 'warning', icon: CircleAlert, to: '/trips?status=missed' },
  { key: 'cancelled', label: 'Cancelled', color: 'danger', icon: Ban, to: '/trips?status=cancelled' },
]

/** Segmented donut of trip statuses. Legend chips link to the filtered Trips page. */
export function StatusRing({ counts }) {
  const ref = useRef(null)
  const inView = useInView(ref, chartViewport)
  const [active, setActive] = useState(null)
  const total = counts.completed + counts.left + counts.missed + counts.cancelled

  const arcs = segments.map((s, i) => {
    const share = total ? counts[s.key] / total : 0
    const before = segments.slice(0, i).reduce((sum, p) => sum + (total ? counts[p.key] / total : 0), 0)
    const length = Math.max(0, share * CIRCUMFERENCE - (share > 0 && share < 1 ? GAP : 0))
    return { ...s, count: counts[s.key], share, length, start: before * CIRCUMFERENCE }
  })

  const focused = arcs.find((a) => a.key === active)
  const summary = `Trip status: ${arcs.map((a) => `${a.count} ${a.label.toLowerCase()}`).join(', ')}. ${total} trips in total.`

  return (
    <div ref={ref} className="flex flex-col items-center gap-4">
      <div role="img" aria-label={summary} tabIndex={0} className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="rgb(var(--border))" strokeWidth={STROKE} />
          {arcs.filter((a) => a.length > 0).map((a, i) => (
            <motion.circle
              key={a.key}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={`rgb(var(--${a.color}))`}
              strokeLinecap="round"
              strokeDasharray={`${a.length} ${CIRCUMFERENCE}`}
              transform={`rotate(${(a.start / CIRCUMFERENCE) * 360 - 90} ${SIZE / 2} ${SIZE / 2})`}
              initial={{ strokeDashoffset: a.length, strokeWidth: STROKE }}
              animate={{ strokeDashoffset: inView ? 0 : a.length, strokeWidth: active === a.key ? STROKE + 5 : STROKE }}
              transition={{ strokeDashoffset: { duration: 0.7, ease, delay: i * 0.15 }, strokeWidth: { duration: 0.2 } }}
              onMouseEnter={() => setActive(a.key)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-heading text-2xl font-extrabold leading-none">{focused ? focused.count : total}</p>
            <p className="mt-1 text-xs text-muted">{focused ? `${focused.label} · ${Math.round(focused.share * 100)}%` : 'Total trips'}</p>
          </div>
        </div>
      </div>

      <ul className="grid w-full grid-cols-2 gap-2">
        {arcs.map((a) => (
          <li key={a.key}>
            <Link
              to={a.to}
              onMouseEnter={() => setActive(a.key)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(a.key)}
              onBlur={() => setActive(null)}
              className={cn(
                'flex items-center justify-between gap-3 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-surface-2',
                active === a.key && 'bg-surface-2',
              )}
            >
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: `rgb(var(--${a.color}))` }} />
                <a.icon size={12} aria-hidden="true" />
                {a.label}
              </span>
              <span className="tabular-nums">{a.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
