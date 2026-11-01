import { useMemo } from 'react'
import { useTripStore } from '../store/useTripStore'

/** One trip with its related records. trip is undefined when the id is unknown. */
export function useTripData(tripId) {
  const trips = useTripStore((s) => s.trips)
  const bookings = useTripStore((s) => s.bookings)
  const itinerary = useTripStore((s) => s.itinerary)
  const expenses = useTripStore((s) => s.expenses)
  const packing = useTripStore((s) => s.packing)
  const notes = useTripStore((s) => s.notes)

  return useMemo(() => {
    const own = (list) => list.filter((item) => item.tripId === tripId)
    return {
      trip: trips.find((t) => t.id === tripId),
      bookings: own(bookings),
      itinerary: own(itinerary),
      expenses: own(expenses),
      packing: own(packing),
      notes: own(notes),
    }
  }, [tripId, trips, bookings, itinerary, expenses, packing, notes])
}
