import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { bookingStatuses, bookingTypes, itineraryStatuses } from '../../lib/categories'
import { tripColor } from '../../lib/colors'
import { parseDate } from '../../lib/dates'
import { cn } from '../../lib/cn'
import { Card } from '../ui/Card'
import { Chip } from '../ui/Chip'

function Section({ title, children }) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-wide text-muted">{title}</h3>
      <ul className="space-y-2">{children}</ul>
    </section>
  )
}

/** Side panel listing one day's trips, flights, hotels and itinerary items. */
export function DayPanel({ date, agenda }) {
  const flights = agenda.bookings.filter((b) => b.type === 'flight')
  const hotels = agenda.bookings.filter((b) => b.type === 'hotel')
  const others = agenda.bookings.filter((b) => b.type !== 'flight' && b.type !== 'hotel')
  const empty = agenda.trips.length + agenda.bookings.length + agenda.items.length === 0

  const bookingRow = (b) => {
    const type = bookingTypes[b.type]
    const status = bookingStatuses[b.status]
    return (
      <li key={b.id} className={cn('flex items-start gap-2 text-sm', b.status === 'cancelled' && 'opacity-60')}>
        <type.icon size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{b.title}</p>
          <p className="text-xs text-muted">
            {b.type === 'hotel' ? 'Stay' : format(new Date(b.startDateTime), 'HH:mm')}
            {b.provider && ` · ${b.provider}`}
          </p>
        </div>
        <Chip tone={status.tone} icon={status.icon} className="!py-0.5">
          {status.label}
        </Chip>
      </li>
    )
  }

  return (
    <Card className="space-y-5 lg:sticky lg:top-20" aria-live="polite">
      <h2 className="text-base font-bold">{format(parseDate(date), 'EEEE, d MMMM')}</h2>
      {empty && <p className="text-sm text-muted">Nothing scheduled for this day.</p>}

      {agenda.trips.length > 0 && (
        <Section title="Trips">
          {agenda.trips.map((t) => (
            <li key={t.id} className="flex items-center gap-2 text-sm">
              <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: tripColor(t.id) }} />
              <Link to={`/trips/${t.id}`} className="truncate font-semibold hover:underline">
                {t.title}
              </Link>
            </li>
          ))}
        </Section>
      )}
      {flights.length > 0 && <Section title="Flights">{flights.map(bookingRow)}</Section>}
      {hotels.length > 0 && <Section title="Hotels">{hotels.map(bookingRow)}</Section>}
      {others.length > 0 && <Section title="Other bookings">{others.map(bookingRow)}</Section>}
      {agenda.items.length > 0 && (
        <Section title="Itinerary">
          {agenda.items.map((i) => {
            const status = itineraryStatuses[i.status]
            return (
              <li key={i.id} className="flex items-start gap-2 text-sm">
                <status.icon size={14} aria-label={status.label} className="mt-0.5 shrink-0 text-muted" />
                <div className="min-w-0 flex-1">
                  <p className={cn('truncate font-semibold', (i.status === 'done' || i.status === 'skipped') && 'text-muted line-through')}>{i.title}</p>
                  <p className="text-xs text-muted">
                    {[i.time, i.place].filter(Boolean).join(' · ')} · {status.label}
                  </p>
                </div>
              </li>
            )
          })}
        </Section>
      )}
    </Card>
  )
}
