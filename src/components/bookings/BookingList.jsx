import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Ticket } from 'lucide-react'
import { listItem } from '../../lib/motion'
import { useAutoAdd } from '../../hooks/useAutoAdd'
import { useTripStore } from '../../store/useTripStore'
import { toast } from '../../store/useToastStore'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { BookingCard } from './BookingCard'
import { BookingForm } from './BookingForm'

/** Bookings tab: cards sorted by start time, with add/edit/delete. */
export function BookingList({ trip, bookings, cancelledTrip }) {
  const [modal, setModal] = useState({ open: false, booking: null })
  const { addBooking, updateBooking, deleteBooking, restore } = useTripStore.getState()
  const close = () => setModal((m) => ({ ...m, open: false }))
  const openAdd = () => setModal({ open: true, booking: null })
  useAutoAdd(openAdd)

  const sorted = useMemo(() => [...bookings].sort((a, b) => a.startDateTime.localeCompare(b.startDateTime)), [bookings])

  const submit = (values) => {
    if (modal.booking) {
      updateBooking(modal.booking.id, values)
      toast('Booking updated')
    } else {
      addBooking({ ...values, tripId: trip.id })
      toast('Booking added')
    }
    close()
  }

  const remove = (booking) => {
    deleteBooking(booking.id)
    toast(`“${booking.title}” deleted`, { actionLabel: 'Undo', onAction: () => restore('bookings', booking) })
  }

  return (
    <div>
      {sorted.length === 0 ? (
        <EmptyState icon={Ticket} title="No bookings yet" message="Add flights, hotels and tickets. Their costs count towards your trip spend automatically.">
          <Button onClick={openAdd}>
            <Plus size={16} aria-hidden="true" /> Add booking
          </Button>
        </EmptyState>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <Button size="sm" onClick={openAdd}>
              <Plus size={14} aria-hidden="true" /> Add booking
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <AnimatePresence initial={false}>
              {sorted.map((booking) => (
                <motion.div key={booking.id} {...listItem}>
                  <BookingCard
                    booking={booking}
                    muted={cancelledTrip}
                    onEdit={() => setModal({ open: true, booking })}
                    onDelete={() => remove(booking)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
      <BookingForm open={modal.open} booking={modal.booking} trip={trip} onClose={close} onSubmit={submit} />
    </div>
  )
}
