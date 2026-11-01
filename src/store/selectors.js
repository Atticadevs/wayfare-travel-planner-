import { addMonths, isAfter, isBefore, isSameMonth, startOfDay } from 'date-fns'
import { daysFromNow, parseDate } from '../lib/dates'
import { bookingExpenseCategory } from '../lib/categories'
import { convert } from '../lib/money'

/**
 * Derived trip status, computed and never stored.
 * Returns 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'missed'.
 */
export function getTripStatus(trip, now = new Date()) {
  if (trip.status === 'completed') return 'completed'
  if (trip.status === 'cancelled') return 'cancelled'
  const today = startOfDay(now)
  if (isBefore(parseDate(trip.endDate), today)) return 'missed'
  if (isAfter(parseDate(trip.startDate), today)) return 'upcoming'
  return 'ongoing'
}

/** Dashboard counters: total, completed, left (upcoming + ongoing), missed, cancelled. */
export function countTripsByStatus(trips, now = new Date()) {
  const counts = { total: trips.length, completed: 0, upcoming: 0, ongoing: 0, missed: 0, cancelled: 0 }
  trips.forEach((trip) => {
    counts[getTripStatus(trip, now)] += 1
  })
  return { ...counts, left: counts.upcoming + counts.ongoing }
}

/** Soonest ongoing or upcoming trip, ongoing first. */
export function getNextTrip(trips, now = new Date()) {
  const active = trips
    .map((trip) => ({ trip, status: getTripStatus(trip, now) }))
    .filter(({ status }) => status === 'ongoing' || status === 'upcoming')
    .sort((a, b) => a.trip.startDate.localeCompare(b.trip.startDate))
  return active.find((x) => x.status === 'ongoing')?.trip ?? active[0]?.trip ?? null
}

export const daysUntilTrip = (trip, now = new Date()) => Math.max(0, daysFromNow(trip.startDate, now))

/** Spend for one trip in its budget currency. Cancelled bookings are excluded. */
export function getTripSpend(trip, bookings, expenses, rates) {
  const target = trip.budget.currency
  const fromBookings = bookings
    .filter((b) => b.tripId === trip.id && b.status !== 'cancelled')
    .reduce((sum, b) => sum + convert(b.cost.amount, b.cost.currency, target, rates), 0)
  const fromExpenses = expenses
    .filter((e) => e.tripId === trip.id)
    .reduce((sum, e) => sum + convert(e.amount, e.currency, target, rates), 0)
  return { bookings: fromBookings, expenses: fromExpenses, total: fromBookings + fromExpenses }
}

/** Sum of budgets for upcoming and ongoing trips, in `currency`. */
export function getActiveBudgetTotal(trips, currency, rates, now = new Date()) {
  return trips
    .filter((trip) => ['upcoming', 'ongoing'].includes(getTripStatus(trip, now)))
    .reduce((sum, trip) => sum + convert(trip.budget.amount, trip.budget.currency, currency, rates), 0)
}

/** Skipped items don't count against progress. */
export function getItineraryProgress(items) {
  const counted = items.filter((i) => i.status !== 'skipped')
  const done = counted.filter((i) => i.status === 'done').length
  return { done, total: counted.length, pct: counted.length ? Math.round((done / counted.length) * 100) : 0 }
}

export function getPackingProgress(items) {
  const packed = items.filter((i) => i.packed).length
  return { packed, total: items.length, pct: items.length ? Math.round((packed / items.length) * 100) : 0 }
}

/**
 * Spend rows for a trip in its budget currency: manual expenses plus non-cancelled
 * bookings (flagged fromBooking). Booking costs are never duplicated as expenses.
 */
export function getSpendRows(trip, bookings, expenses, rates) {
  const target = trip.budget.currency
  const rows = []
  bookings
    .filter((b) => b.tripId === trip.id && b.status !== 'cancelled')
    .forEach((b) =>
      rows.push({
        id: b.id,
        title: b.title,
        category: bookingExpenseCategory[b.type] ?? 'other',
        date: b.startDateTime.slice(0, 10),
        original: b.cost,
        converted: convert(b.cost.amount, b.cost.currency, target, rates),
        fromBooking: true,
      }),
    )
  expenses
    .filter((e) => e.tripId === trip.id)
    .forEach((e) =>
      rows.push({
        id: e.id,
        title: e.title,
        category: e.category,
        date: e.date,
        original: { amount: e.amount, currency: e.currency },
        converted: convert(e.amount, e.currency, target, rates),
        fromBooking: false,
      }),
    )
  return rows
}

/**
 * One value per month offset (0 = this month, -1 = last month ...), summing pick(trip, status)
 * over trips that start in that month.
 */
export function getMonthlySeries(trips, offsets, now, pick) {
  return offsets.map((offset) => {
    const month = addMonths(now, offset)
    return trips.reduce(
      (sum, trip) => (isSameMonth(parseDate(trip.startDate), month) ? sum + pick(trip, getTripStatus(trip, now)) : sum),
      0,
    )
  })
}

/** Itinerary completion for each month (Jan to Dec) of `year`. Skipped items don't count. */
export function getMonthlyItineraryCompletion(items, year) {
  return Array.from({ length: 12 }, (_, month) => {
    const inMonth = items.filter((i) => {
      const d = parseDate(i.date)
      return d.getFullYear() === year && d.getMonth() === month && i.status !== 'skipped'
    })
    const done = inMonth.filter((i) => i.status === 'done').length
    return { month, done, total: inMonth.length, pct: inMonth.length ? Math.round((done / inMonth.length) * 100) : 0 }
  })
}

/** Everything happening on one ISO date: trips spanning it, bookings spanning it, itinerary items on it. */
export function getDayAgenda(date, trips, bookings, itinerary) {
  return {
    trips: trips.filter((t) => t.startDate <= date && date <= t.endDate),
    bookings: bookings.filter((b) => b.startDateTime.slice(0, 10) <= date && date <= b.endDateTime.slice(0, 10)),
    items: itinerary.filter((i) => i.date === date).sort((a, b) => (a.time || '').localeCompare(b.time || '')),
  }
}

/** Totals per expense category from getSpendRows output. */
export function sumByCategory(rows) {
  return rows.reduce((acc, r) => ({ ...acc, [r.category]: (acc[r.category] ?? 0) + r.converted }), {})
}
