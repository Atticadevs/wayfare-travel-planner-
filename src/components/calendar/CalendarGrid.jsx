import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, isSameDay, isSameMonth } from 'date-fns'
import { tripColor } from '../../lib/colors'
import { getMonthWeeks, weekBars } from '../../lib/calendar'
import { toISODate } from '../../lib/dates'
import { ease } from '../../lib/motion'
import { cn } from '../../lib/cn'

const NUMBER_ROW = 32
const BAR = 18
const MARKERS_ROW = 26
const MAX_LANES = 4

const dotColors = { flight: 'bg-info', hotel: 'bg-primary' }

/**
 * Month grid. Trips are continuous bars (stacked when overlapping); each day shows booking dots
 * and an itinerary count. Days are buttons; bars link to the trip.
 */
export function CalendarGrid({ month, trips, bookings, itinerary, selected, onSelect, today }) {
  const weeks = getMonthWeeks(month)

  return (
    <div role="grid" aria-label={format(month, 'MMMM yyyy')} className="overflow-hidden rounded-card border border-border bg-surface">
      <div role="row" className="grid grid-cols-7 border-b border-border bg-surface-2 text-center text-xs font-bold uppercase text-muted">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <span key={d} role="columnheader" className="py-2">
            {d}
          </span>
        ))}
      </div>
      {weeks.map((week) => {
        const bars = weekBars(week, trips).filter((b) => b.lane < MAX_LANES)
        const lanes = Math.max(1, ...bars.map((b) => b.lane + 1))
        const height = NUMBER_ROW + lanes * BAR + MARKERS_ROW
        return (
          <div key={week[0].toISOString()} role="row" className="relative border-b border-border last:border-0" style={{ height }}>
            <div className="grid h-full grid-cols-7">
              {week.map((day) => {
                const iso = toISODate(day)
                const dayBookings = bookings.filter((b) => b.startDateTime.slice(0, 10) === iso)
                const dayItems = itinerary.filter((i) => i.date === iso)
                const spanning = trips.filter((t) => t.startDate <= iso && iso <= t.endDate)
                const isSelected = iso === selected
                const label = [
                  format(day, 'EEEE d MMMM'),
                  spanning.length && spanning.map((t) => t.title).join(', '),
                  dayBookings.length && `${dayBookings.length} booking${dayBookings.length === 1 ? '' : 's'}`,
                  dayItems.length && `${dayItems.length} plan${dayItems.length === 1 ? '' : 's'}`,
                ].filter(Boolean).join(', ')
                return (
                  <button
                    key={iso}
                    type="button"
                    role="gridcell"
                    aria-selected={isSelected}
                    aria-label={label}
                    onClick={() => onSelect(iso)}
                    className={cn(
                      'flex h-full flex-col items-start justify-between border-l border-border p-1.5 text-left first:border-l-0 transition-colors hover:bg-surface-2',
                      isSelected && 'bg-primary/10',
                    )}
                  >
                    <span
                      className={cn(
                        'grid h-6 w-6 place-items-center rounded-full text-xs font-semibold',
                        !isSameMonth(day, month) && 'text-muted/50',
                        isSameDay(day, today) && 'ring-2 ring-primary/50',
                        isSelected && 'bg-primary text-on-primary',
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    <span className="flex items-center gap-1" aria-hidden="true">
                      {dayBookings.slice(0, 3).map((b) => (
                        <span key={b.id} className={cn('h-1.5 w-1.5 rounded-full', dotColors[b.type] ?? 'bg-accent', b.status === 'cancelled' && 'opacity-40')} />
                      ))}
                      {dayItems.length > 0 && (
                        <span className="rounded bg-surface-2 px-1 text-[10px] font-bold text-muted">{dayItems.length}</span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
            {bars.map(({ trip, startCol, endCol, lane, startsHere, endsHere }) => {
              const color = tripColor(trip.id)
              return (
                <motion.div
                  key={trip.id}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.45, ease }}
                  className="absolute"
                  style={{
                    originX: 0,
                    top: NUMBER_ROW + lane * BAR,
                    height: BAR - 3,
                    left: `calc(${(startCol / 7) * 100}% + 2px)`,
                    width: `calc(${((endCol - startCol + 1) / 7) * 100}% - 4px)`,
                  }}
                >
                  <Link
                    to={`/trips/${trip.id}`}
                    aria-label={`Open ${trip.title}`}
                    className={cn(
                      'block h-full truncate px-2 text-[11px] font-bold leading-[15px] text-text',
                      startsHere && 'rounded-l-full',
                      endsHere && 'rounded-r-full',
                      trip.status === 'cancelled' && 'opacity-60 line-through',
                    )}
                    style={{ background: `${color}33`, borderLeft: startsHere ? `3px solid ${color}` : undefined }}
                  >
                    {startsHere || startCol === 0 ? trip.title : ''}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
