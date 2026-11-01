import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownUp, LayoutGrid, List, Map, Plus, Search, SearchX, Sparkles } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { TripCard } from '../components/trips/TripCard'
import { TripDrawer } from '../components/trips/TripDrawer'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Select } from '../components/ui/Select'
import { statusFilters, statusMeta } from '../lib/status'
import { toast } from '../store/useToastStore'
import { cn } from '../lib/cn'
import { countTripsByStatus, getTripStatus } from '../store/selectors'
import { useTripStore } from '../store/useTripStore'

const viewOptions = [
  { value: 'grid', label: 'Grid', icon: LayoutGrid },
  { value: 'list', label: 'List', icon: List },
]

const sortOptions = [
  { value: 'date', label: 'Date' },
  { value: 'budget', label: 'Budget' },
  { value: 'name', label: 'Name' },
]

const sorters = {
  date: (a, b) => b.trip.startDate.localeCompare(a.trip.startDate),
  budget: (a, b) => b.trip.budget.amount - a.trip.budget.amount,
  name: (a, b) => a.trip.title.localeCompare(b.trip.title),
}

export default function Trips() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const trips = useTripStore((s) => s.trips)
  const { addTrip, updateTrip, removeTrip, restoreTrip, duplicateTrip, loadDemoData } = useTripStore.getState()

  const filter = statusFilters.includes(params.get('status')) ? params.get('status') : 'all'
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('date')
  const [view, setView] = useState('grid')
  const [drawer, setDrawer] = useState({ open: false, trip: null })
  const [confirmCancel, setConfirmCancel] = useState(null)

  const now = useMemo(() => new Date(), [])
  const counts = useMemo(() => countTripsByStatus(trips, now), [trips, now])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return trips
      .map((trip) => ({ trip, status: getTripStatus(trip, now) }))
      .filter(({ trip, status }) => (filter === 'all' || status === filter)
        && (!q || `${trip.title} ${trip.destination} ${trip.country}`.toLowerCase().includes(q)))
      .sort(sorters[sort])
  }, [trips, filter, query, sort, now])

  const setFilter = (next) => setParams(next === 'all' ? {} : { status: next }, { replace: true })
  const openAdd = () => setDrawer({ open: true, trip: null })
  const closeDrawer = () => setDrawer((d) => ({ ...d, open: false }))

  const submitTrip = (data) => {
    if (drawer.trip) {
      updateTrip(drawer.trip.id, data)
      toast('Trip updated')
    } else {
      const id = addTrip({ ...data, status: 'planned' })
      toast('Trip created', { actionLabel: 'Add itinerary', onAction: () => navigate(`/trips/${id}?tab=itinerary&add=1`) })
    }
    closeDrawer()
  }

  const actions = {
    edit: (trip) => setDrawer({ open: true, trip }),
    duplicate: (trip) => {
      const id = duplicateTrip(trip.id)
      toast('Trip duplicated', { actionLabel: 'Open', onAction: () => navigate(`/trips/${id}`) })
    },
    complete: (trip) => {
      const previous = trip.status
      updateTrip(trip.id, { status: 'completed' })
      toast(`“${trip.title}” marked completed`, { actionLabel: 'Undo', onAction: () => updateTrip(trip.id, { status: previous }) })
    },
    restore: (trip) => {
      const previous = trip.status
      updateTrip(trip.id, { status: 'planned' })
      toast('Trip restored', { actionLabel: 'Undo', onAction: () => updateTrip(trip.id, { status: previous }) })
    },
    cancel: (trip) => setConfirmCancel(trip),
    remove: (trip) => {
      const bundle = removeTrip(trip.id)
      toast(`“${trip.title}” deleted`, { actionLabel: 'Undo', onAction: () => restoreTrip(bundle) })
    },
  }

  const confirmCancelTrip = () => {
    const trip = confirmCancel
    updateTrip(trip.id, { status: 'cancelled' })
    setConfirmCancel(null)
    toast(`“${trip.title}” cancelled`, { actionLabel: 'Undo', onAction: () => updateTrip(trip.id, { status: trip.status }) })
  }

  const chips = [{ id: 'all', label: 'All', count: counts.total }, ...statusFilters.map((id) => ({ id, label: statusMeta[id].label, count: counts[id] }))]

  return (
    <PageShell
      title="Trips"
      subtitle="Everything you’ve planned, in one place"
      actions={
        <Button onClick={openAdd}>
          <Plus size={16} aria-hidden="true" /> Add trip
        </Button>
      }
    >
      {trips.length === 0 ? (
        <EmptyState icon={Map} title="No trips yet" message="Plan your first trip, or load sample trips to explore Wayfare.">
          <Button onClick={openAdd}>
            <Plus size={16} aria-hidden="true" /> Plan your first trip
          </Button>
          <Button variant="secondary" onClick={loadDemoData}>
            <Sparkles size={16} aria-hidden="true" /> Load demo data
          </Button>
        </EmptyState>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[12rem] flex-1 md:max-w-sm">
                <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  aria-label="Search trips"
                  placeholder="Search by title or destination"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-10 w-full rounded-control border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-muted/70 focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownUp size={16} aria-hidden="true" className="text-muted" />
                <Select className="w-32" options={sortOptions} value={sort} onChange={setSort} searchable={false} ariaLabel="Sort trips" />
              </div>
              <SegmentedControl label="View" options={viewOptions} value={view} onChange={setView} className="ml-auto" />
            </div>
            <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
              {chips.map(({ id, label, count }) => {
                const active = filter === id
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(id)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                      active ? 'border-primary bg-primary text-on-primary' : 'border-border bg-surface text-muted hover:text-text',
                    )}
                  >
                    {label} <span className="opacity-70">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {visible.length === 0 ? (
            <EmptyState icon={SearchX} title="No matching trips" message="Try a different search or filter.">
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('')
                  setFilter('all')
                }}
              >
                Clear filters
              </Button>
            </EmptyState>
          ) : (
            <motion.div
              layout
              className={cn('grid gap-5', view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}
              aria-live="polite"
            >
              <AnimatePresence mode="popLayout">
                {visible.map(({ trip, status }) => (
                  <TripCard key={trip.id} trip={trip} status={status} view={view} actions={actions} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}

      <TripDrawer open={drawer.open} trip={drawer.trip} onClose={closeDrawer} onSubmit={submitTrip} />
      <ConfirmDialog
        open={Boolean(confirmCancel)}
        title="Cancel this trip?"
        message="It stays in your history as Cancelled and its bookings are greyed out. You can restore it later."
        confirmLabel="Cancel trip"
        cancelLabel="Keep trip"
        destructive
        onConfirm={confirmCancelTrip}
        onCancel={() => setConfirmCancel(null)}
      />
    </PageShell>
  )
}
