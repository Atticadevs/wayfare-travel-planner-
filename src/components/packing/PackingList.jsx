import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Luggage, Plus, RotateCcw, Sparkles, X } from 'lucide-react'
import { packingGroups, toOptions } from '../../lib/categories'
import { listItem } from '../../lib/motion'
import { cn } from '../../lib/cn'
import { getPackingProgress } from '../../store/selectors'
import { toast } from '../../store/useToastStore'
import { useTripStore } from '../../store/useTripStore'
import { ProgressRing } from '../charts/ProgressRing'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Checkbox } from '../ui/Checkbox'
import { EmptyState } from '../ui/EmptyState'
import { Select } from '../ui/Select'

const groupOptions = toOptions(packingGroups)

/** Grouped packing checklist with progress ring, quick add, starter essentials and reset. */
export function PackingList({ trip, items }) {
  const [label, setLabel] = useState('')
  const [group, setGroup] = useState('other')
  const input = useRef(null)
  const { addPackingItem, updatePackingItem, deletePackingItem, addEssentials, resetPacking, restore } = useTripStore.getState()

  const progress = useMemo(() => getPackingProgress(items), [items])
  const grouped = useMemo(
    () => Object.keys(packingGroups).map((key) => ({ key, items: items.filter((i) => i.group === key) })).filter((g) => g.items.length > 0),
    [items],
  )

  const add = (e) => {
    e.preventDefault()
    const text = label.trim()
    if (!text) {
      input.current?.focus()
      return
    }
    addPackingItem({ tripId: trip.id, label: text, group, packed: false })
    setLabel('')
    input.current?.focus()
  }

  const addStarter = () => {
    const before = useTripStore.getState().packing.length
    addEssentials(trip.id)
    const added = useTripStore.getState().packing.length - before
    toast(added ? `Added ${added} essentials` : 'Your list already has all the essentials')
  }

  const remove = (item) => {
    deletePackingItem(item.id)
    toast(`“${item.label}” removed`, { actionLabel: 'Undo', onAction: () => restore('packing', item) })
  }

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center gap-5">
        <ProgressRing value={progress.pct} size={88} stroke={9} tone={progress.pct === 100 ? 'success' : 'primary'} label="Packing progress" />
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold">
            {progress.packed} of {progress.total} packed
          </p>
          <p className="text-sm text-muted">{progress.pct === 100 && progress.total > 0 ? 'All packed. Safe travels!' : 'Tick items off as they go in the bag.'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={addStarter}>
            <Sparkles size={14} aria-hidden="true" /> Add essentials
          </Button>
          <Button variant="ghost" size="sm" disabled={progress.packed === 0} onClick={() => resetPacking(trip.id)}>
            <RotateCcw size={14} aria-hidden="true" /> Reset all
          </Button>
        </div>
      </Card>

      <form onSubmit={add} className="flex flex-wrap items-end gap-2">
        <div className="min-w-[10rem] flex-1">
          <label htmlFor="packing-label" className="mb-1.5 block text-xs font-semibold text-muted">
            Add an item
          </label>
          <input
            ref={input}
            id="packing-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Sunglasses"
            className="h-10 w-full rounded-control border border-border bg-surface px-3 text-sm placeholder:text-muted/70 focus:border-primary"
          />
        </div>
        <Select ariaLabel="Group" className="w-40" options={groupOptions} value={group} onChange={setGroup} searchable={false} />
        <Button type="submit">
          <Plus size={16} aria-hidden="true" /> Add
        </Button>
      </form>

      {items.length === 0 ? (
        <EmptyState icon={Luggage} title="Your bag is empty" message="Add items one by one, or start from a handy essentials list." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {grouped.map(({ key, items: groupItems }) => {
            const meta = packingGroups[key]
            return (
              <Card key={key} className="!p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                  <meta.icon size={16} aria-hidden="true" className="text-primary" />
                  {meta.label}
                  <span className="font-medium text-muted">
                    {groupItems.filter((i) => i.packed).length}/{groupItems.length}
                  </span>
                </h3>
                <ul className="space-y-1">
                  <AnimatePresence initial={false}>
                    {groupItems.map((item) => (
                      <motion.li key={item.id} {...listItem} className="flex items-center justify-between gap-2 rounded-lg px-1 py-1.5 hover:bg-surface-2">
                        <Checkbox
                          checked={item.packed}
                          onChange={(packed) => updatePackingItem(item.id, { packed })}
                          label={<span className={cn('transition-colors', item.packed && 'text-muted line-through')}>{item.label}</span>}
                        />
                        <Button variant="ghost" size="sm" icon aria-label={`Remove ${item.label}`} onClick={() => remove(item)}>
                          <X size={14} aria-hidden="true" />
                        </Button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
