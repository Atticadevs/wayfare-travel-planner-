import { Ban, CalendarClock, CircleAlert, CircleCheck, Plane } from 'lucide-react'

/** Presentation for each derived trip status. Icon + label always accompany color. */
export const statusMeta = {
  upcoming: { label: 'Upcoming', tone: 'info', icon: CalendarClock },
  ongoing: { label: 'Ongoing', tone: 'success', icon: Plane },
  completed: { label: 'Completed', tone: 'primary', icon: CircleCheck },
  missed: { label: 'Missed', tone: 'warning', icon: CircleAlert },
  cancelled: { label: 'Cancelled', tone: 'danger', icon: Ban },
}

export const statusFilters = ['upcoming', 'ongoing', 'completed', 'missed', 'cancelled']
