import { Reorder, useDragControls } from 'framer-motion'
import { ArrowDown, ArrowUp, GripVertical, MapPin, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { itineraryCategories, itineraryStatuses } from '../../lib/categories'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { Checkbox } from '../ui/Checkbox'
import { Chip } from '../ui/Chip'
import { Dropdown } from '../ui/Dropdown'

/** One draggable itinerary row. Reordering is also available from the menu for keyboard and touch. */
export function ItineraryItemRow({ item, canMoveUp, canMoveDown, onStatus, onEdit, onDelete, onMove }) {
  const controls = useDragControls()
  const category = itineraryCategories[item.category]
  const status = itineraryStatuses[item.status]
  const finished = item.status === 'done' || item.status === 'skipped'

  const statusMenu = Object.entries(itineraryStatuses).map(([value, meta]) => ({
    label: meta.label,
    icon: meta.icon,
    onSelect: () => onStatus(value),
  }))

  const menu = [
    { label: 'Edit', icon: Pencil, onSelect: onEdit },
    { label: 'Mark in progress', icon: itineraryStatuses.in_progress.icon, onSelect: () => onStatus('in_progress') },
    { label: 'Skip item', icon: itineraryStatuses.skipped.icon, onSelect: () => onStatus('skipped') },
    ...(canMoveUp ? [{ label: 'Move up', icon: ArrowUp, onSelect: () => onMove(-1) }] : []),
    ...(canMoveDown ? [{ label: 'Move down', icon: ArrowDown, onSelect: () => onMove(1) }] : []),
    { label: 'Delete', icon: Trash2, danger: true, onSelect: onDelete },
  ]

  return (
    <Reorder.Item
      as="li"
      value={item.id}
      dragListener={false}
      dragControls={controls}
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: finished ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
      whileDrag={{ scale: 1.02, boxShadow: '0 14px 32px rgba(20,26,42,.18)' }}
      className="relative flex items-center gap-2 rounded-control border border-border bg-surface px-2 py-2.5 sm:gap-3 sm:px-3"
    >
      <button
        type="button"
        aria-label={`Drag to reorder ${item.title}`}
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab touch-none rounded p-1 text-muted hover:text-text active:cursor-grabbing"
      >
        <GripVertical size={16} aria-hidden="true" />
      </button>
      <Checkbox
        checked={item.status === 'done'}
        onChange={(checked) => onStatus(checked ? 'done' : 'todo')}
        aria-label={`Mark ${item.title} as done`}
      />
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-sm font-semibold transition-colors', finished && 'text-muted line-through')}>{item.title}</p>
        <p className="flex flex-wrap items-center gap-x-3 text-xs text-muted">
          {item.time && <span>{item.time}</span>}
          {item.place && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={11} aria-hidden="true" /> {item.place}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <category.icon size={11} aria-hidden="true" /> {category.label}
          </span>
        </p>
      </div>
      <div className="hidden sm:block">
        <Dropdown
          label={`Change status of ${item.title}`}
          items={statusMenu}
          trigger={(props) => (
            <button type="button" {...props} className="rounded-full">
              <Chip tone={status.tone} icon={status.icon}>
                {status.label}
              </Chip>
            </button>
          )}
        />
      </div>
      <Dropdown
        label={`Actions for ${item.title}`}
        items={menu}
        trigger={(props) => (
          <Button {...props} variant="ghost" size="sm" icon>
            <MoreHorizontal size={16} aria-hidden="true" />
          </Button>
        )}
      />
    </Reorder.Item>
  )
}
