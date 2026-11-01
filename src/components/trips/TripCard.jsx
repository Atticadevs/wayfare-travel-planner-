import { forwardRef, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Ban, Copy, CircleCheck, MoreHorizontal, Pencil, Trash2, Undo2, Users, Wallet } from 'lucide-react'
import { coverBackground } from '../../lib/colors'
import { tripDayCount } from '../../lib/dates'
import { flagEmoji, formatDateRange, formatMoney } from '../../lib/format'
import { listItem, spring } from '../../lib/motion'
import { statusMeta } from '../../lib/status'
import { cn } from '../../lib/cn'
import { getItineraryProgress } from '../../store/selectors'
import { useTripStore } from '../../store/useTripStore'
import { Button } from '../ui/Button'
import { Chip } from '../ui/Chip'
import { Dropdown } from '../ui/Dropdown'
import { ProgressBar } from '../ui/ProgressBar'

/** Trip summary as a grid card or a list row. forwardRef lets AnimatePresence track exits. */
export const TripCard = forwardRef(function TripCard({ trip, status, view, actions }, ref) {
  const itinerary = useTripStore((s) => s.itinerary)
  const [promptDismissed, setPromptDismissed] = useState(false)
  const progress = useMemo(() => getItineraryProgress(itinerary.filter((i) => i.tripId === trip.id)), [itinerary, trip.id])
  const meta = statusMeta[status]
  const isList = view === 'list'
  const flag = flagEmoji(trip.countryCode)

  const menu = [
    { label: 'Edit', icon: Pencil, onSelect: () => actions.edit(trip) },
    { label: 'Duplicate', icon: Copy, onSelect: () => actions.duplicate(trip) },
    ...(status === 'completed' || status === 'cancelled'
      ? [{ label: 'Restore as planned', icon: Undo2, onSelect: () => actions.restore(trip) }]
      : [{ label: 'Mark completed', icon: CircleCheck, onSelect: () => actions.complete(trip) }]),
    ...(status !== 'cancelled' ? [{ label: 'Cancel trip', icon: Ban, onSelect: () => actions.cancel(trip) }] : []),
    { label: 'Delete', icon: Trash2, danger: true, onSelect: () => actions.remove(trip) },
  ]

  return (
    <motion.article
      ref={ref}
      {...listItem}
      whileHover={{ y: -3 }}
      transition={spring}
      aria-label={trip.title}
      className={cn(
        'group relative rounded-card bg-surface shadow-card-themed transition-shadow focus-within:z-20 hover:shadow-lift',
        isList ? 'flex flex-col sm:flex-row' : 'flex flex-col',
        status === 'cancelled' && 'opacity-75',
      )}
    >
      <div
        className={cn('relative shrink-0 rounded-t-card', isList ? 'h-28 sm:h-auto sm:w-48 sm:rounded-l-card sm:rounded-tr-none' : 'h-36')}
        style={{ background: coverBackground(trip.coverImage) }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" aria-hidden="true" />
        <Chip tone={meta.tone} icon={meta.icon} className="absolute left-3 top-3 bg-surface/95 shadow-sm">
          {meta.label}
        </Chip>
        {flag && (
          <span aria-hidden="true" className="absolute bottom-2 left-3 text-2xl drop-shadow">
            {flag}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold">
              <Link to={`/trips/${trip.id}`} className="rounded after:absolute after:inset-0 after:content-['']">
                {trip.title}
              </Link>
            </h3>
            <p className="truncate text-sm text-muted">
              {trip.destination}, {trip.country}
            </p>
          </div>
          <div className="flex shrink-0 items-center">
            <Button
              variant="ghost"
              size="sm"
              icon
              className="relative z-10 hover:text-danger-fg"
              aria-label={`Delete ${trip.title}`}
              onClick={() => actions.remove(trip)}
            >
              <Trash2 size={16} aria-hidden="true" />
            </Button>
            <Dropdown
              label={`Actions for ${trip.title}`}
              items={menu}
              trigger={(props) => (
                <Button {...props} variant="ghost" size="sm" icon className="relative z-10">
                  <MoreHorizontal size={16} aria-hidden="true" />
                </Button>
              )}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <span>
            {formatDateRange(trip.startDate, trip.endDate)} · {tripDayCount(trip)} days
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={12} aria-hidden="true" /> {trip.travelers}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-text">
            <Wallet size={12} aria-hidden="true" /> {formatMoney(trip.budget.amount, trip.budget.currency)}
          </span>
        </div>

        {trip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {trip.tags.slice(0, 3).map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>Itinerary</span>
            <span>
              {progress.done}/{progress.total} done
            </span>
          </div>
          <ProgressBar value={progress.pct} label={`${trip.title} itinerary progress`} tone={progress.pct === 100 ? 'success' : 'primary'} />
        </div>

        {status === 'missed' && !promptDismissed && (
          <div className="relative z-10 rounded-control bg-warning/15 p-3 text-xs text-warning-fg">
            <p className="font-semibold">This trip’s dates passed. Mark as completed or missed?</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => actions.complete(trip)}>
                Mark completed
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setPromptDismissed(true)}>
                Keep as missed
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.article>
  )
})
