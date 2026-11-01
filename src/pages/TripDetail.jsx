import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert, Compass, LayoutDashboard, ListChecks, Luggage, StickyNote, Ticket, Wallet } from 'lucide-react'
import { BudgetTab } from '../components/budget/BudgetTab'
import { BookingList } from '../components/bookings/BookingList'
import { ItineraryList } from '../components/itinerary/ItineraryList'
import { NoteList } from '../components/notes/NoteList'
import { PackingList } from '../components/packing/PackingList'
import { TripDrawer } from '../components/trips/TripDrawer'
import { TripHeader } from '../components/trips/TripHeader'
import { TripOverview } from '../components/trips/TripOverview'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { Tabs } from '../components/ui/Tabs'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useRates } from '../hooks/useRates'
import { useTripData } from '../hooks/useTripData'
import { fadeUp } from '../lib/motion'
import { getTripSpend, getTripStatus } from '../store/selectors'
import { toast } from '../store/useToastStore'
import { useTripStore } from '../store/useTripStore'

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'itinerary', label: 'Itinerary', icon: ListChecks },
  { id: 'bookings', label: 'Bookings', icon: Ticket },
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'packing', label: 'Packing', icon: Luggage },
  { id: 'notes', label: 'Notes', icon: StickyNote },
]

export default function TripDetail() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const { trip, bookings, itinerary, expenses, packing, notes } = useTripData(id)
  const rates = useRates()
  const updateTrip = useTripStore((s) => s.updateTrip)
  const [editing, setEditing] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [missedDismissed, setMissedDismissed] = useState(false)

  useDocumentTitle(trip ? trip.title : 'Trip not found')

  const tab = tabs.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'overview'
  const status = trip ? getTripStatus(trip) : null
  const spent = useMemo(() => (trip ? getTripSpend(trip, bookings, expenses, rates).total : 0), [trip, bookings, expenses, rates])

  if (!trip) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 pt-8 md:px-8">
        <EmptyState icon={Compass} title="Trip not found" message="It may have been deleted.">
          <Link to="/trips">
            <Button>Back to trips</Button>
          </Link>
        </EmptyState>
      </div>
    )
  }

  const open = (next, add = false) => setParams(add ? { tab: next, add: '1' } : { tab: next })
  const complete = () => {
    const previous = trip.status
    updateTrip(trip.id, { status: 'completed' })
    toast('Trip marked completed', { actionLabel: 'Undo', onAction: () => updateTrip(trip.id, { status: previous }) })
  }
  const cancel = () => {
    const previous = trip.status
    updateTrip(trip.id, { status: 'cancelled' })
    setConfirmCancel(false)
    toast('Trip cancelled', { actionLabel: 'Undo', onAction: () => updateTrip(trip.id, { status: previous }) })
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 px-4 pb-12 pt-6 md:px-8 md:pt-8">
      <TripHeader
        trip={trip}
        status={status}
        spent={spent}
        onEdit={() => setEditing(true)}
        onComplete={complete}
        onCancel={() => setConfirmCancel(true)}
        onRestore={() => updateTrip(trip.id, { status: 'planned' })}
      />

      {status === 'missed' && !missedDismissed && (
        <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-control bg-warning/15 px-4 py-3 text-sm text-warning-fg">
          <p className="flex items-center gap-2 font-semibold">
            <CircleAlert size={16} aria-hidden="true" /> This trip’s dates passed. Mark as completed or missed?
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={complete}>
              Mark completed
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setMissedDismissed(true)}>
              Keep as missed
            </Button>
          </div>
        </div>
      )}

      <Tabs tabs={tabs} value={tab} onChange={(next) => open(next)} label="Trip sections" />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={tab} {...fadeUp}>
          {tab === 'overview' && <TripOverview trip={trip} bookings={bookings} itinerary={itinerary} packing={packing} spent={spent} onOpen={open} />}
          {tab === 'itinerary' && <ItineraryList trip={trip} items={itinerary} />}
          {tab === 'bookings' && <BookingList trip={trip} bookings={bookings} cancelledTrip={status === 'cancelled'} />}
          {tab === 'budget' && <BudgetTab trip={trip} bookings={bookings} expenses={expenses} />}
          {tab === 'packing' && <PackingList trip={trip} items={packing} />}
          {tab === 'notes' && <NoteList trip={trip} notes={notes} />}
        </motion.div>
      </AnimatePresence>

      <TripDrawer
        open={editing}
        trip={trip}
        onClose={() => setEditing(false)}
        onSubmit={(data) => {
          updateTrip(trip.id, data)
          setEditing(false)
          toast('Trip updated')
        }}
      />
      <ConfirmDialog
        open={confirmCancel}
        title="Cancel this trip?"
        message="It stays in your history as Cancelled and its bookings are greyed out. You can restore it later."
        confirmLabel="Cancel trip"
        cancelLabel="Keep trip"
        destructive
        onConfirm={cancel}
        onCancel={() => setConfirmCancel(false)}
      />
    </div>
  )
}
