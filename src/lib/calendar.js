import { eachDayOfInterval, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns'
import { toISODate } from './dates'

export const weekOptions = { weekStartsOn: 1 }

/** The month as rows of 7 days (Monday first), padded with neighbouring months. */
export function getMonthWeeks(month) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), weekOptions),
    end: endOfWeek(endOfMonth(month), weekOptions),
  })
  return Array.from({ length: days.length / 7 }, (_, i) => days.slice(i * 7, i * 7 + 7))
}

/**
 * Trip bars for one week row: [{ trip, startCol, endCol, lane, startsHere, endsHere }].
 * Overlapping trips are stacked into lanes with greedy packing.
 */
export function weekBars(week, trips) {
  const first = toISODate(week[0])
  const last = toISODate(week[6])
  const laneEnds = []
  return trips
    .filter((t) => t.startDate <= last && t.endDate >= first)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .map((trip) => {
      const startCol = Math.max(0, week.findIndex((d) => toISODate(d) >= trip.startDate))
      const endCol = week.findLastIndex((d) => toISODate(d) <= trip.endDate)
      const free = laneEnds.findIndex((end) => end < startCol)
      const lane = free === -1 ? laneEnds.length : free
      laneEnds[lane] = endCol
      return { trip, startCol, endCol, lane, startsHere: trip.startDate >= first, endsHere: trip.endDate <= last }
    })
}
