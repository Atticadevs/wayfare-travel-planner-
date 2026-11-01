import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { differenceInCalendarDays, endOfYear, format, startOfYear } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { parseDate } from '../../lib/dates'
import { formatDateRange } from '../../lib/format'
import { chartViewport, ease } from '../../lib/motion'
import { statusMeta } from '../../lib/status'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { SegmentedControl } from '../ui/SegmentedControl'

const ZOOMS = { year: 3, quarter: 8, month: 18 } // pixels per day
const zoomOptions = [
  { value: 'year', label: 'Year' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'month', label: 'Month' },
]
const LANE = 34
const HEADER = 26

const blockTones = {
  info: 'border-info/50 bg-info/20 text-info-fg',
  success: 'border-success/50 bg-success/20 text-success-fg',
  primary: 'border-primary/50 bg-primary/15 text-primary',
  warning: 'border-warning/60 bg-warning/25 text-warning-fg',
  danger: 'border-danger/50 bg-danger/15 text-danger-fg',
}

/** Greedy lane packing so overlapping trips stack. */
function assignLanes(blocks) {
  const laneEnds = []
  return [...blocks]
    .sort((a, b) => a.from - b.from)
    .map((b) => {
      const free = laneEnds.findIndex((end) => end <= b.from)
      const lane = free === -1 ? laneEnds.length : free
      laneEnds[lane] = b.to
      return { ...b, lane }
    })
}

/** Year timeline: trips as rounded blocks sized by duration, coloured by status. Scrollable, zoomable. */
export function TimelineStrip({ trips, now }) {
  const [year, setYear] = useState(now.getFullYear())
  const [zoom, setZoom] = useState('year')
  const scroller = useRef(null)
  const ppd = ZOOMS[zoom]
  const yearStart = startOfYear(new Date(year, 0, 1))
  const totalDays = differenceInCalendarDays(endOfYear(yearStart), yearStart) + 1

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, m) => {
        const start = new Date(year, m, 1)
        return { label: format(start, 'MMM'), left: differenceInCalendarDays(start, yearStart), days: differenceInCalendarDays(new Date(year, m + 1, 1), start) }
      }),
    [year, yearStart],
  )

  const blocks = useMemo(() => {
    const raw = trips
      .map(({ trip, status }) => ({
        trip,
        status,
        from: Math.max(0, differenceInCalendarDays(parseDate(trip.startDate), yearStart)),
        to: Math.min(totalDays, differenceInCalendarDays(parseDate(trip.endDate), yearStart) + 1),
      }))
      .filter((b) => b.to > 0 && b.from < totalDays)
    return assignLanes(raw)
  }, [trips, yearStart, totalDays])

  const lanes = Math.max(1, ...blocks.map((b) => b.lane + 1))
  const todayOffset = differenceInCalendarDays(now, yearStart)
  const showToday = todayOffset >= 0 && todayOffset < totalDays

  // Bring "today" (or January) into view when the zoom or year changes.
  useEffect(() => {
    if (scroller.current) scroller.current.scrollLeft = showToday ? Math.max(0, todayOffset * ppd - 120) : 0
  }, [ppd, year, showToday, todayOffset])

  const summary = `Trip timeline for ${year}: ${blocks.map((b) => `${b.trip.title} (${statusMeta[b.status].label})`).join(', ') || 'no trips'}.`

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon aria-label="Previous year" onClick={() => setYear((y) => y - 1)}>
            <ChevronLeft size={16} aria-hidden="true" />
          </Button>
          <span className="w-12 text-center font-heading text-sm font-bold">{year}</span>
          <Button variant="ghost" size="sm" icon aria-label="Next year" onClick={() => setYear((y) => y + 1)}>
            <ChevronRight size={16} aria-hidden="true" />
          </Button>
        </div>
        <SegmentedControl label="Timeline zoom" options={zoomOptions} value={zoom} onChange={setZoom} />
      </div>

      <div ref={scroller} role="group" aria-label={summary} tabIndex={0} className="overflow-x-auto rounded-control border border-border bg-surface-2">
        <div className="relative" style={{ width: totalDays * ppd, height: HEADER + lanes * LANE + 8 }}>
          {months.map((m, i) => (
            <div key={m.label} className={cn('absolute inset-y-0 border-border', i > 0 && 'border-l')} style={{ left: m.left * ppd, width: m.days * ppd }}>
              <span className="block px-2 pt-1 text-[11px] font-bold text-muted">{m.label}</span>
            </div>
          ))}
          {showToday && (
            <div aria-hidden="true" className="absolute inset-y-0 z-10 w-0.5 bg-accent" style={{ left: todayOffset * ppd }}>
              <span className="absolute left-1 top-1 rounded bg-accent px-1 text-[9px] font-bold text-on-accent">Today</span>
            </div>
          )}
          {blocks.map(({ trip, status, from, to, lane }) => {
            const meta = statusMeta[status]
            return (
              <motion.div
                key={trip.id}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={chartViewport}
                transition={{ duration: 0.6, ease }}
                className="absolute"
                style={{ originX: 0, left: from * ppd + 1, width: Math.max((to - from) * ppd - 2, 10), top: HEADER + lane * LANE, height: LANE - 6 }}
              >
                <Link
                  to={`/trips/${trip.id}`}
                  title={`${trip.title} · ${formatDateRange(trip.startDate, trip.endDate)} · ${meta.label}`}
                  aria-label={`${trip.title}, ${meta.label}, ${formatDateRange(trip.startDate, trip.endDate)}`}
                  className={cn('flex h-full items-center gap-1.5 overflow-hidden rounded-full border px-2.5 text-xs font-semibold', blockTones[meta.tone])}
                >
                  <meta.icon size={12} aria-hidden="true" className="shrink-0" />
                  <span className="truncate">{trip.title}</span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
