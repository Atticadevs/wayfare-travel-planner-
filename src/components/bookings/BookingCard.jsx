import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { bookingStatuses, bookingTypes } from '../../lib/categories'
import { formatMoney } from '../../lib/format'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Chip } from '../ui/Chip'
import { Dropdown } from '../ui/Dropdown'
import { ConfirmationCode } from './ConfirmationCode'
import { FlightTicket } from './FlightTicket'

/** Booking card; flights use the ticket layout. `muted` greys it out (cancelled trip). */
export function BookingCard({ booking, muted, onEdit, onDelete }) {
  const type = bookingTypes[booking.type]
  const status = bookingStatuses[booking.status]
  const start = parseISO(booking.startDateTime)
  const end = parseISO(booking.endDateTime)

  const actions = (
    <Dropdown
      label={`Actions for ${booking.title}`}
      items={[
        { label: 'Edit', icon: Pencil, onSelect: onEdit },
        { label: 'Delete', icon: Trash2, danger: true, onSelect: onDelete },
      ]}
      trigger={(props) => (
        <Button {...props} variant="ghost" size="sm" icon>
          <MoreHorizontal size={16} aria-hidden="true" />
        </Button>
      )}
    />
  )

  const greyed = muted || booking.status === 'cancelled'

  if (booking.type === 'flight') {
    return (
      <div className={cn(greyed && 'opacity-60 grayscale')}>
        <FlightTicket booking={booking} actions={actions} />
      </div>
    )
  }

  const nights = differenceInCalendarDays(end, start)

  return (
    <Card className={cn('space-y-3 !p-4', greyed && 'opacity-60 grayscale')}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue text-primary">
            <type.icon size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold">{booking.title}</p>
            <p className="text-xs text-muted">
              {type.label} · {booking.provider}
            </p>
          </div>
        </div>
        {actions}
      </div>

      {booking.type === 'hotel' ? (
        <dl className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <dt className="text-muted">Check-in</dt>
            <dd className="font-semibold">{format(start, 'EEE d MMM')}</dd>
          </div>
          <div>
            <dt className="text-muted">Check-out</dt>
            <dd className="font-semibold">{format(end, 'EEE d MMM')}</dd>
          </div>
          <div>
            <dt className="text-muted">Nights</dt>
            <dd className="font-semibold">{nights}</dd>
          </div>
        </dl>
      ) : (
        <p className="text-xs text-muted">
          {format(start, 'EEE d MMM · HH:mm')}
          {booking.from && booking.to && ` · ${booking.from} → ${booking.to}`}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <ConfirmationCode code={booking.confirmationCode} />
        <span className="text-sm font-semibold">{formatMoney(booking.cost.amount, booking.cost.currency)}</span>
        <Chip tone={status.tone} icon={status.icon}>
          {status.label}
        </Chip>
      </div>
    </Card>
  )
}
