import {
  Ban, BedDouble, Bus, Car, Circle, CircleCheck, Clock, Droplets, FileText, Landmark, LoaderCircle, Package, Plane,
  Plug, ShoppingBag, Shirt, SkipForward, Sparkles, Ticket, TrainFront, Utensils,
} from 'lucide-react'

export const itineraryCategories = {
  sightseeing: { label: 'Sightseeing', icon: Landmark },
  food: { label: 'Food', icon: Utensils },
  transport: { label: 'Transport', icon: Bus },
  stay: { label: 'Stay', icon: BedDouble },
  shopping: { label: 'Shopping', icon: ShoppingBag },
  other: { label: 'Other', icon: Sparkles },
}

export const itineraryStatuses = {
  todo: { label: 'To do', icon: Circle, tone: 'neutral' },
  in_progress: { label: 'In progress', icon: LoaderCircle, tone: 'info' },
  done: { label: 'Done', icon: CircleCheck, tone: 'success' },
  skipped: { label: 'Skipped', icon: SkipForward, tone: 'neutral' },
}

export const bookingTypes = {
  flight: { label: 'Flight', icon: Plane, transport: true },
  hotel: { label: 'Hotel', icon: BedDouble },
  train: { label: 'Train', icon: TrainFront, transport: true },
  bus: { label: 'Bus', icon: Bus, transport: true },
  car: { label: 'Car', icon: Car, transport: true },
  activity: { label: 'Activity', icon: Ticket },
  other: { label: 'Other', icon: Package },
}

export const bookingStatuses = {
  confirmed: { label: 'Confirmed', icon: CircleCheck, tone: 'success' },
  pending: { label: 'Pending', icon: Clock, tone: 'warning' },
  cancelled: { label: 'Cancelled', icon: Ban, tone: 'danger' },
}

/** `color` names a CSS token (rgb(var(--color))) used by charts. */
export const expenseCategories = {
  transport: { label: 'Transport', icon: Bus, color: 'info' },
  stay: { label: 'Stay', icon: BedDouble, color: 'primary' },
  food: { label: 'Food', icon: Utensils, color: 'accent' },
  activities: { label: 'Activities', icon: Ticket, color: 'success' },
  shopping: { label: 'Shopping', icon: ShoppingBag, color: 'warning' },
  other: { label: 'Other', icon: Package, color: 'text-muted' },
}

/** Booking costs roll into these expense categories. */
export const bookingExpenseCategory = {
  flight: 'transport', train: 'transport', bus: 'transport', car: 'transport', hotel: 'stay', activity: 'activities', other: 'other',
}

export const packingGroups = {
  documents: { label: 'Documents', icon: FileText },
  clothes: { label: 'Clothes', icon: Shirt },
  toiletries: { label: 'Toiletries', icon: Droplets },
  electronics: { label: 'Electronics', icon: Plug },
  other: { label: 'Other', icon: Package },
}

export const toOptions = (map) => Object.entries(map).map(([value, { label }]) => ({ value, label }))
