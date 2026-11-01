import { Link } from 'react-router-dom'
import { ArrowRight, Plus } from 'lucide-react'
import { coverBackground } from '../../lib/colors'
import { parseDate, tripDayCount } from '../../lib/dates'
import { flagEmoji, formatDateRange } from '../../lib/format'
import { useNow } from '../../hooks/useNow'
import { BudgetGauge } from '../charts/BudgetGauge'
import { Button } from '../ui/Button'

const HOUR = 3600000
const DAY = 24 * HOUR

function Unit({ value, label }) {
  return (
    <div className="min-w-14 rounded-control bg-white/20 px-3 py-2 text-center backdrop-blur">
      <p className="font-heading text-2xl font-extrabold leading-none tabular-nums">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide">{label}</p>
    </div>
  )
}

/** Highlight card for the ongoing or next upcoming trip, with a live countdown. */
export function NextTripHero({ trip, status, spent }) {
  const now = useNow(30000)
  const start = parseDate(trip.startDate)
  const ms = Math.max(0, start - now)
  const dayNumber = Math.floor((now - start) / DAY) + 1
  const flag = flagEmoji(trip.countryCode)

  return (
    <section
      aria-label="Next trip"
      className="relative h-full overflow-hidden rounded-card text-white shadow-card"
      style={{ background: coverBackground(trip.coverImage) }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/10" aria-hidden="true" />
      <div className="relative flex h-full flex-col justify-between gap-6 p-6 md:flex-row md:items-end">
        <div className="min-w-0">
          <p className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
            {status === 'ongoing' ? 'Happening now' : 'Next trip'}
          </p>
          <h2 className="text-3xl font-extrabold drop-shadow">{trip.destination}</h2>
          <p className="mt-1 text-sm drop-shadow">
            {flag && <span aria-hidden="true">{flag} </span>}
            {trip.title} · {formatDateRange(trip.startDate, trip.endDate)}
          </p>

          <div className="mt-5 flex gap-2" role="timer" aria-live="off">
            {status === 'ongoing' ? (
              <>
                <Unit value={dayNumber} label="Day" />
                <Unit value={tripDayCount(trip)} label="Of days" />
              </>
            ) : (
              <>
                <Unit value={Math.floor(ms / DAY)} label="Days" />
                <Unit value={Math.floor((ms % DAY) / HOUR)} label="Hours" />
              </>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link to={`/trips/${trip.id}`}>
              <Button variant="secondary">
                Open trip <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </Link>
            <Link to={`/trips/${trip.id}?tab=budget&add=1`}>
              <Button variant="accent">
                <Plus size={16} aria-hidden="true" /> Add expense
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-44 shrink-0 self-start rounded-card bg-surface p-3 text-text md:self-end">
          <BudgetGauge spent={spent} budget={trip.budget.amount} currency={trip.budget.currency} className="w-full" />
        </div>
      </div>
    </section>
  )
}
