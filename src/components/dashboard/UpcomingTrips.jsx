import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { parseDate } from '../../lib/dates'
import { formatMoney } from '../../lib/format'
import { statusMeta } from '../../lib/status'
import { getItineraryProgress } from '../../store/selectors'
import { ChartCard } from '../charts/ChartCard'
import { Chip } from '../ui/Chip'
import { ProgressBar } from '../ui/ProgressBar'

const MAX = 6

/** Compact list of ongoing and upcoming trips (soonest first). `trips` is [{ trip, status }]. */
export function UpcomingTrips({ trips, itinerary }) {
  const rows = useMemo(
    () =>
      trips.slice(0, MAX).map(({ trip, status }) => ({
        trip,
        status,
        progress: getItineraryProgress(itinerary.filter((i) => i.tripId === trip.id)),
      })),
    [trips, itinerary],
  )

  return (
    <ChartCard
      title="Upcoming trips"
      subtitle="Ongoing and coming up next"
      empty={rows.length === 0 && 'No upcoming trips. Time to plan one!'}
      action={
        <Link to="/trips" className="text-xs font-semibold text-primary hover:underline">
          View all
        </Link>
      }
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ trip, status, progress }) => {
          const start = parseDate(trip.startDate)
          return (
            <li key={trip.id}>
              <Link
                to={`/trips/${trip.id}`}
                className="flex items-center gap-3 rounded-control border border-border p-3 transition-colors hover:bg-surface-2"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue text-center leading-tight text-primary">
                  <span>
                    <span className="block text-[10px] font-bold uppercase">{format(start, 'MMM')}</span>
                    <span className="block font-heading text-lg font-extrabold">{format(start, 'd')}</span>
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold">{trip.title}</span>
                    {status === 'ongoing' && (
                      <Chip tone="success" icon={statusMeta.ongoing.icon} className="shrink-0 !py-0.5">
                        Ongoing
                      </Chip>
                    )}
                  </span>
                  <span className="mb-1.5 block text-xs text-muted">
                    {trip.destination} · {formatMoney(trip.budget.amount, trip.budget.currency, { compact: true })}
                  </span>
                  <ProgressBar value={progress.pct} label={`${trip.title} itinerary progress`} className="h-1.5" />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </ChartCard>
  )
}
