import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  addMonths, format, isSameDay, isSameMonth, startOfMonth,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { tripColor } from '../../lib/colors'
import { parseDate, toISODate } from '../../lib/dates'
import { ease } from '../../lib/motion'
import { getMonthWeeks, weekBars } from '../../lib/calendar'
import { cn } from '../../lib/cn'
import { getDayAgenda } from '../../store/selectors'
import { itineraryStatuses } from '../../lib/categories'
import { ChartCard } from '../charts/ChartCard'
import { Button } from '../ui/Button'

const LANE_HEIGHT = 5
const MAX_LANES = 3

/** Month grid with trip ranges as coloured bars. Click a day to see its trips, bookings and plans. */
export function MiniCalendar({ trips, bookings, itinerary }) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [selected, setSelected] = useState(() => toISODate(new Date()))

  const visibleTrips = useMemo(() => trips.filter((t) => t.status !== 'cancelled'), [trips])
  const weeks = useMemo(() => getMonthWeeks(month), [month])
  const agenda = useMemo(() => getDayAgenda(selected, visibleTrips, bookings, itinerary), [selected, visibleTrips, bookings, itinerary])
  const today = new Date()

  const nothing = agenda.trips.length + agenda.bookings.length + agenda.items.length === 0

  return (
    <ChartCard
      title="Calendar"
      subtitle={format(month, 'MMMM yyyy')}
      action={
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon aria-label="Previous month" onClick={() => setMonth((m) => addMonths(m, -1))}>
            <ChevronLeft size={16} aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="sm" icon aria-label="Next month" onClick={() => setMonth((m) => addMonths(m, 1))}>
            <ChevronRight size={16} aria-hidden="true" />
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-7 text-center text-[10px] font-bold uppercase text-muted" aria-hidden="true">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <span key={d} className="py-1">
            {d}
          </span>
        ))}
      </div>
      <div>
        {weeks.map((week) => (
          <div key={week[0].toISOString()} className="relative">
            <div className="grid grid-cols-7">
              {week.map((day) => {
                const iso = toISODate(day)
                const spanning = visibleTrips.filter((t) => t.startDate <= iso && iso <= t.endDate)
                const isSelected = iso === selected
                return (
                  <button
                    key={iso}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`${format(day, 'EEEE d MMMM')}${spanning.length ? `, ${spanning.map((t) => t.title).join(', ')}` : ''}`}
                    onClick={() => setSelected(iso)}
                    className="grid h-11 place-items-start justify-center pt-1"
                  >
                    <span
                      className={cn(
                        'grid h-6 w-6 place-items-center rounded-full text-xs font-semibold transition-colors',
                        !isSameMonth(day, month) && 'text-muted/50',
                        isSameDay(day, today) && 'ring-2 ring-primary/40',
                        isSelected && 'bg-primary text-on-primary',
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-1" aria-hidden="true">
              {weekBars(week, visibleTrips)
                .filter((b) => b.lane < MAX_LANES)
                .map(({ trip, startCol, endCol, lane }) => (
                  <motion.span
                    key={trip.id}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease }}
                    style={{
                      originX: 0,
                      position: 'absolute',
                      left: `calc(${(startCol / 7) * 100}% + 2px)`,
                      width: `calc(${((endCol - startCol + 1) / 7) * 100}% - 4px)`,
                      bottom: lane * (LANE_HEIGHT + 1),
                      height: LANE_HEIGHT,
                      borderRadius: 999,
                      background: tripColor(trip.id),
                    }}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-border pt-3" aria-live="polite">
        <p className="mb-2 text-xs font-bold">{format(parseDate(selected), 'EEEE, d MMMM')}</p>
        {nothing ? (
          <p className="text-xs text-muted">Nothing scheduled.</p>
        ) : (
          <ul className="space-y-1.5 text-xs">
            {agenda.trips.map((t) => (
              <li key={t.id} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: tripColor(t.id) }} />
                <Link to={`/trips/${t.id}`} className="truncate font-semibold hover:underline">
                  {t.title}
                </Link>
              </li>
            ))}
            {agenda.bookings.map((b) => (
              <li key={b.id} className="text-muted">
                {b.type === 'hotel' ? 'Stay' : b.type}: {b.title}
              </li>
            ))}
            {agenda.items.map((i) => {
              const status = itineraryStatuses[i.status]
              return (
                <li key={i.id} className="flex items-center gap-1.5 text-muted">
                  <status.icon size={12} aria-label={status.label} className="shrink-0" />
                  <span className={cn(i.status === 'done' && 'line-through')}>
                    {i.time && `${i.time} · `}
                    {i.title}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </ChartCard>
  )
}
