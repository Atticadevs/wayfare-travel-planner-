import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { addMonths, format, isSameMonth, startOfMonth } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CalendarGrid } from '../components/calendar/CalendarGrid'
import { DayPanel } from '../components/calendar/DayPanel'
import { PageShell } from '../components/layout/PageShell'
import { Button } from '../components/ui/Button'
import { useNow } from '../hooks/useNow'
import { tripColor } from '../lib/colors'
import { toISODate } from '../lib/dates'
import { ease } from '../lib/motion'
import { statusFilters, statusMeta } from '../lib/status'
import { cn } from '../lib/cn'
import { getDayAgenda, getTripStatus } from '../store/selectors'
import { useTripStore } from '../store/useTripStore'

const slide = {
  enter: (dir) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease } },
  exit: (dir) => ({ x: dir * -48, opacity: 0, transition: { duration: 0.2, ease } }),
}

export default function CalendarPage() {
  const now = useNow(60000)
  const trips = useTripStore((s) => s.trips)
  const bookings = useTripStore((s) => s.bookings)
  const itinerary = useTripStore((s) => s.itinerary)
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [direction, setDirection] = useState(1)
  const [selected, setSelected] = useState(() => toISODate(new Date()))
  const [hidden, setHidden] = useState(() => new Set())

  const shown = useMemo(() => trips.filter((t) => !hidden.has(getTripStatus(t, now))), [trips, hidden, now])
  const shownIds = useMemo(() => new Set(shown.map((t) => t.id)), [shown])
  const shownBookings = useMemo(() => bookings.filter((b) => shownIds.has(b.tripId)), [bookings, shownIds])
  const shownItems = useMemo(() => itinerary.filter((i) => shownIds.has(i.tripId)), [itinerary, shownIds])
  const agenda = useMemo(() => getDayAgenda(selected, shown, shownBookings, shownItems), [selected, shown, shownBookings, shownItems])
  const legend = useMemo(
    () => shown.filter((t) => t.startDate.slice(0, 7) <= format(month, 'yyyy-MM') && t.endDate.slice(0, 7) >= format(month, 'yyyy-MM')),
    [shown, month],
  )

  const go = (step) => {
    setDirection(step)
    setMonth((m) => addMonths(m, step))
  }
  const goToday = () => {
    const today = startOfMonth(new Date())
    setDirection(today > month ? 1 : -1)
    setMonth(today)
    setSelected(toISODate(new Date()))
  }
  const toggle = (status) =>
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(status)) next.delete(status)
      else next.add(status)
      return next
    })

  return (
    <PageShell
      title="Calendar"
      subtitle="Trips, bookings and plans by day"
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={goToday} disabled={isSameMonth(month, now)}>
            Today
          </Button>
          <Button variant="ghost" size="sm" icon aria-label="Previous month" onClick={() => go(-1)}>
            <ChevronLeft size={18} aria-hidden="true" />
          </Button>
          <span className="w-32 text-center font-heading text-sm font-bold" aria-live="polite">
            {format(month, 'MMMM yyyy')}
          </span>
          <Button variant="ghost" size="sm" icon aria-label="Next month" onClick={() => go(1)}>
            <ChevronRight size={18} aria-hidden="true" />
          </Button>
        </>
      }
    >
      <div role="group" aria-label="Show trips by status" className="mb-4 flex flex-wrap gap-2">
        {statusFilters.map((status) => {
          const meta = statusMeta[status]
          const on = !hidden.has(status)
          return (
            <button
              key={status}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(status)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                on ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted line-through hover:text-text',
              )}
            >
              <meta.icon size={12} aria-hidden="true" />
              {meta.label}
            </button>
          )
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div key={format(month, 'yyyy-MM')} custom={direction} variants={slide} initial="enter" animate="center" exit="exit">
                <CalendarGrid month={month} trips={shown} bookings={shownBookings} itinerary={shownItems} selected={selected} onSelect={setSelected} today={now} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted" aria-label="Legend">
            {legend.map((t) => (
              <span key={t.id} className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: tripColor(t.id) }} />
                {t.title}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-info" /> Flight
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" /> Hotel
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" /> Other booking
            </span>
            <span>Numbers show itinerary items</span>
          </div>
        </div>
        <DayPanel date={selected} agenda={agenda} />
      </div>
    </PageShell>
  )
}
