import { differenceInMinutes, format, parseISO } from 'date-fns'
import { Plane } from 'lucide-react'
import { bookingStatuses } from '../../lib/categories'
import { formatMoney } from '../../lib/format'
import { Chip } from '../ui/Chip'
import { ConfirmationCode } from './ConfirmationCode'

function duration(start, end) {
  const minutes = differenceInMinutes(parseISO(end), parseISO(start))
  if (minutes <= 0) return ''
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`
}

/** Boarding-pass style layout for flight bookings. */
export function FlightTicket({ booking, actions }) {
  const status = bookingStatuses[booking.status]
  const start = parseISO(booking.startDateTime)
  const end = parseISO(booking.endDateTime)
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <div className="bg-blue/60 p-4 dark:bg-blue/40">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-bold">{booking.title}</p>
            <p className="text-xs text-muted">{booking.provider}</p>
          </div>
          {actions}
        </div>
        <div className="flex items-center gap-3">
          <div>
            <p className="font-heading text-3xl font-extrabold tracking-wide">{booking.from}</p>
            <p className="text-xs text-muted">{format(start, 'EEE d MMM · HH:mm')}</p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-xs text-muted" aria-hidden="true">
            <div className="flex w-full items-center gap-1">
              <span className="h-px flex-1 border-t border-dashed border-muted" />
              <Plane size={16} className="text-primary" />
              <span className="h-px flex-1 border-t border-dashed border-muted" />
            </div>
            <span>{duration(booking.startDateTime, booking.endDateTime)}</span>
          </div>
          <div className="text-right">
            <p className="font-heading text-3xl font-extrabold tracking-wide">{booking.to}</p>
            <p className="text-xs text-muted">{format(end, 'EEE d MMM · HH:mm')}</p>
          </div>
        </div>
      </div>
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-border px-4 py-3">
        <span aria-hidden="true" className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-bg" />
        <span aria-hidden="true" className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-bg" />
        <ConfirmationCode code={booking.confirmationCode} />
        <span className="text-sm font-semibold">{formatMoney(booking.cost.amount, booking.cost.currency)}</span>
        <Chip tone={status.tone} icon={status.icon}>
          {status.label}
        </Chip>
      </div>
    </div>
  )
}
