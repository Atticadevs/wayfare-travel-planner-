import { addDays, differenceInCalendarDays, eachDayOfInterval, format, parseISO, startOfDay } from 'date-fns'

export const toISODate = (date) => format(date, 'yyyy-MM-dd')

export const parseDate = (iso) => startOfDay(parseISO(iso))

export const tripDayCount = (trip) => differenceInCalendarDays(parseDate(trip.endDate), parseDate(trip.startDate)) + 1

export const tripDays = (trip) => eachDayOfInterval({ start: parseDate(trip.startDate), end: parseDate(trip.endDate) })

export const daysFromNow = (iso, now = new Date()) => differenceInCalendarDays(parseDate(iso), now)

export { addDays }
