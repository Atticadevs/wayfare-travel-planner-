import { useMemo } from 'react'
import { format } from 'date-fns'
import { CalendarDays, Plus, Receipt, StickyNote, Ticket, ListChecks } from 'lucide-react'
import { toISODate, tripDayCount, tripDays } from '../../lib/dates'
import { formatMoney } from '../../lib/format'
import { getItineraryProgress, getPackingProgress } from '../../store/selectors'
import { ProgressRing } from '../charts/ProgressRing'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'

function Tile({ label, children }) {
  return (
    <Card className="flex flex-col gap-2 !p-4">
      <p className="text-xs font-semibold text-muted">{label}</p>
      {children}
    </Card>
  )
}

const quickAdds = [
  { tab: 'itinerary', label: 'Itinerary item', icon: ListChecks },
  { tab: 'bookings', label: 'Booking', icon: Ticket },
  { tab: 'budget', label: 'Expense', icon: Receipt },
  { tab: 'notes', label: 'Note', icon: StickyNote },
]

/** Summary tiles, a day-by-day strip and quick-add shortcuts. `onOpen(tab, add)` switches tabs. */
export function TripOverview({ trip, bookings, itinerary, packing, spent, onOpen }) {
  const progress = useMemo(() => getItineraryProgress(itinerary), [itinerary])
  const packed = useMemo(() => getPackingProgress(packing), [packing])
  const days = useMemo(() => tripDays(trip), [trip])
  const budgetRatio = trip.budget.amount > 0 ? (spent / trip.budget.amount) * 100 : 0
  const activeBookings = bookings.filter((b) => b.status !== 'cancelled').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Tile label="Days">
          <p className="font-heading text-3xl font-extrabold">{tripDayCount(trip)}</p>
        </Tile>
        <Tile label="Bookings">
          <p className="font-heading text-3xl font-extrabold">{activeBookings}</p>
        </Tile>
        <Tile label="Itinerary done">
          <ProgressRing value={progress.pct} size={64} stroke={7} tone={progress.pct === 100 ? 'success' : 'primary'} label="Itinerary done" />
        </Tile>
        <Tile label="Spent vs budget">
          <p className="text-sm font-bold">
            {formatMoney(spent, trip.budget.currency, { compact: true })} <span className="font-medium text-muted">of {formatMoney(trip.budget.amount, trip.budget.currency, { compact: true })}</span>
          </p>
          <ProgressBar value={budgetRatio} label="Budget used" tone={budgetRatio >= 100 ? 'danger' : budgetRatio >= 80 ? 'warning' : 'success'} />
        </Tile>
        <Tile label="Packed">
          <ProgressRing value={packed.pct} size={64} stroke={7} tone={packed.pct === 100 ? 'success' : 'accent'} label="Packing progress" />
        </Tile>
      </div>

      <section aria-label="Trip days">
        <h2 className="mb-3 flex items-center gap-2 text-base font-bold">
          <CalendarDays size={16} aria-hidden="true" /> Day by day
        </h2>
        <ol className="flex gap-3 overflow-x-auto pb-2">
          {days.map((day, index) => {
            const iso = toISODate(day)
            const items = itinerary.filter((i) => i.date === iso)
            const done = items.filter((i) => i.status === 'done').length
            return (
              <li key={iso} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onOpen('itinerary')}
                  className="w-28 rounded-control border border-border bg-surface p-3 text-left transition-colors hover:bg-surface-2"
                >
                  <p className="text-xs text-muted">Day {index + 1}</p>
                  <p className="text-sm font-bold">{format(day, 'EEE d MMM')}</p>
                  <p className="mt-1 text-xs text-muted">{items.length === 0 ? 'Free day' : `${done}/${items.length} done`}</p>
                </button>
              </li>
            )
          })}
        </ol>
      </section>

      <section aria-label="Quick add">
        <h2 className="mb-3 text-base font-bold">Quick add</h2>
        <div className="flex flex-wrap gap-2">
          {quickAdds.map(({ tab, label, icon: Icon }) => (
            <Button key={tab} variant="secondary" size="sm" onClick={() => onOpen(tab, true)}>
              <Plus size={14} aria-hidden="true" />
              <Icon size={14} aria-hidden="true" /> {label}
            </Button>
          ))}
        </div>
      </section>
    </div>
  )
}
