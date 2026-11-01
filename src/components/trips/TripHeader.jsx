import { Link } from 'react-router-dom'
import { ArrowLeft, Ban, CircleCheck, Pencil, Undo2 } from 'lucide-react'
import { coverBackground } from '../../lib/colors'
import { daysFromNow, tripDayCount } from '../../lib/dates'
import { flagEmoji, formatDateRange } from '../../lib/format'
import { statusMeta } from '../../lib/status'
import { BudgetGauge } from '../charts/BudgetGauge'
import { Button } from '../ui/Button'
import { Chip } from '../ui/Chip'
import { Dropdown } from '../ui/Dropdown'

function countdown(trip, status) {
  const until = daysFromNow(trip.startDate)
  if (status === 'upcoming') return until === 0 ? 'Starts today' : `Starts in ${until} day${until === 1 ? '' : 's'}`
  if (status === 'ongoing') return `Day ${-until + 1} of ${tripDayCount(trip)}`
  if (status === 'completed') return 'Trip completed'
  if (status === 'missed') return 'Dates have passed'
  return 'Trip cancelled'
}

/** Cover, title, editable status, countdown and a compact budget gauge. */
export function TripHeader({ trip, status, spent, onEdit, onComplete, onCancel, onRestore }) {
  const meta = statusMeta[status]
  const flag = flagEmoji(trip.countryCode)

  const statusItems = [
    ...(status !== 'completed' && status !== 'cancelled' ? [{ label: 'Mark completed', icon: CircleCheck, onSelect: onComplete }] : []),
    ...(status !== 'cancelled' ? [{ label: 'Cancel trip', icon: Ban, onSelect: onCancel }] : []),
    ...(status === 'completed' || status === 'cancelled' ? [{ label: 'Restore as planned', icon: Undo2, onSelect: onRestore }] : []),
  ]

  return (
    <header className="relative overflow-hidden rounded-card text-white shadow-card" style={{ background: coverBackground(trip.coverImage) }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10" aria-hidden="true" />
      <div className="relative flex flex-col gap-6 p-5 md:flex-row md:items-end md:justify-between md:p-8">
        <div className="min-w-0">
          <Link to="/trips" className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-xs font-semibold backdrop-blur hover:bg-black/40">
            <ArrowLeft size={14} aria-hidden="true" /> All trips
          </Link>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Dropdown
              label="Change trip status"
              items={statusItems}
              trigger={(props) => (
                <button type="button" {...props} className="rounded-full">
                  <Chip tone={meta.tone} icon={meta.icon} className="bg-surface text-text">
                    {meta.label}
                  </Chip>
                </button>
              )}
            />
            <span className="text-sm font-semibold drop-shadow">{countdown(trip, status)}</span>
          </div>
          <h1 className="text-3xl font-extrabold drop-shadow md:text-4xl">{trip.title}</h1>
          <p className="mt-1 text-sm drop-shadow">
            {flag && <span aria-hidden="true">{flag} </span>}
            {trip.destination}, {trip.country} · {formatDateRange(trip.startDate, trip.endDate)} · {tripDayCount(trip)} days
          </p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={onEdit}>
            <Pencil size={14} aria-hidden="true" /> Edit trip
          </Button>
        </div>
        <div className="w-44 shrink-0 rounded-card bg-surface p-3 text-text md:w-52">
          <BudgetGauge spent={spent} budget={trip.budget.amount} currency={trip.budget.currency} className="w-full" />
        </div>
      </div>
    </header>
  )
}
