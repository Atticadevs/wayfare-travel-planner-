import { useMemo, useState } from 'react'
import { AnimatePresence, Reorder } from 'framer-motion'
import { format } from 'date-fns'
import { ListChecks, Plus } from 'lucide-react'
import { itineraryStatuses } from '../../lib/categories'
import { parseDate, tripDays, toISODate } from '../../lib/dates'
import { useAutoAdd } from '../../hooks/useAutoAdd'
import { getItineraryProgress } from '../../store/selectors'
import { useTripStore } from '../../store/useTripStore'
import { toast } from '../../store/useToastStore'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { ProgressBar } from '../ui/ProgressBar'
import { SegmentedControl } from '../ui/SegmentedControl'
import { ItineraryForm } from './ItineraryForm'
import { ItineraryItemRow } from './ItineraryItemRow'

const filterOptions = [
  { value: 'all', label: 'All' },
  ...Object.entries(itineraryStatuses).map(([value, { label }]) => ({ value, label })),
]

const byOrder = (a, b) => a.order - b.order

/** Day-grouped itinerary with status filter, progress bar, drag-and-drop reorder and add/edit/delete. */
export function ItineraryList({ trip, items }) {
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState({ open: false, item: null, date: null })
  const { addItineraryItem, updateItineraryItem, deleteItineraryItem, reorderItinerary, restore } = useTripStore.getState()

  const openAdd = (date) => setModal({ open: true, item: null, date: date ?? trip.startDate })
  useAutoAdd(() => openAdd())

  const progress = useMemo(() => getItineraryProgress(items), [items])

  const days = useMemo(() => {
    const inTrip = tripDays(trip).map(toISODate)
    const extra = [...new Set(items.map((i) => i.date))].filter((d) => !inTrip.includes(d)).sort()
    return [...inTrip, ...extra].map((date) => ({
      date,
      all: items.filter((i) => i.date === date).sort(byOrder),
    }))
  }, [trip, items])

  const nextOrder = () => items.reduce((max, i) => Math.max(max, i.order), -1) + 1

  const submit = (values) => {
    if (modal.item) {
      const moved = values.date !== modal.item.date
      updateItineraryItem(modal.item.id, { ...values, ...(moved ? { order: nextOrder() } : {}) })
      toast('Item updated')
    } else {
      addItineraryItem({ ...values, tripId: trip.id, order: nextOrder() })
      toast('Item added')
    }
    setModal((m) => ({ ...m, open: false }))
  }

  const remove = (item) => {
    deleteItineraryItem(item.id)
    toast(`“${item.title}” deleted`, { actionLabel: 'Undo', onAction: () => restore('itinerary', item) })
  }

  const move = (day, item, step) => {
    const ids = day.all.map((i) => i.id)
    const from = ids.indexOf(item.id)
    ids.splice(from + step, 0, ids.splice(from, 1)[0])
    reorderItinerary(ids)
  }

  if (items.length === 0) {
    return (
      <>
        <EmptyState icon={ListChecks} title="Nothing planned yet" message="Add places, meals and activities day by day.">
          <Button onClick={() => openAdd()}>
            <Plus size={16} aria-hidden="true" /> Add first item
          </Button>
        </EmptyState>
        <ItineraryForm open={modal.open} item={modal.item} defaultDate={modal.date} trip={trip} onClose={() => setModal((m) => ({ ...m, open: false }))} onSubmit={submit} />
      </>
    )
  }

  return (
    <div>
      <div className="mb-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">
            {progress.done} of {progress.total} done
          </p>
          <Button size="sm" onClick={() => openAdd()}>
            <Plus size={14} aria-hidden="true" /> Add item
          </Button>
        </div>
        <ProgressBar value={progress.pct} label="Itinerary progress" tone={progress.pct === 100 ? 'success' : 'primary'} />
        <SegmentedControl label="Filter by status" options={filterOptions} value={filter} onChange={setFilter} className="max-w-full overflow-x-auto" />
      </div>

      <div className="space-y-5">
        {days.map((day, index) => {
          const visible = day.all.filter((i) => filter === 'all' || i.status === filter)
          if (filter !== 'all' && visible.length === 0) return null
          return (
            <section key={day.date} aria-label={`Day ${index + 1}`}>
              <header className="sticky top-16 z-10 -mx-1 mb-2 flex items-center justify-between bg-bg/90 px-1 py-2 backdrop-blur">
                <h3 className="text-sm font-bold">
                  Day {index + 1} <span className="font-medium text-muted">· {format(parseDate(day.date), 'EEE, d MMM')}</span>
                </h3>
                <Button variant="ghost" size="sm" icon aria-label={`Add item on day ${index + 1}`} onClick={() => openAdd(day.date)}>
                  <Plus size={14} aria-hidden="true" />
                </Button>
              </header>
              {visible.length === 0 ? (
                <p className="rounded-control border border-dashed border-border px-3 py-4 text-center text-xs text-muted">Nothing planned for this day.</p>
              ) : (
                <Reorder.Group as="ul" axis="y" values={visible.map((i) => i.id)} onReorder={reorderItinerary} className="space-y-2">
                  <AnimatePresence initial={false}>
                    {visible.map((item) => {
                      const position = day.all.findIndex((i) => i.id === item.id)
                      return (
                        <ItineraryItemRow
                          key={item.id}
                          item={item}
                          canMoveUp={position > 0}
                          canMoveDown={position < day.all.length - 1}
                          onStatus={(status) => updateItineraryItem(item.id, { status })}
                          onEdit={() => setModal({ open: true, item, date: item.date })}
                          onDelete={() => remove(item)}
                          onMove={(step) => move(day, item, step)}
                        />
                      )
                    })}
                  </AnimatePresence>
                </Reorder.Group>
              )}
            </section>
          )
        })}
      </div>

      <ItineraryForm open={modal.open} item={modal.item} defaultDate={modal.date} trip={trip} onClose={() => setModal((m) => ({ ...m, open: false }))} onSubmit={submit} />
    </div>
  )
}
