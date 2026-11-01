import { AnimatePresence, motion } from 'framer-motion'
import { MoreHorizontal, Pencil, Plus, Receipt, Ticket, Trash2 } from 'lucide-react'
import { expenseCategories } from '../../lib/categories'
import { formatDate, formatMoney } from '../../lib/format'
import { listItem } from '../../lib/motion'
import { Button } from '../ui/Button'
import { Chip } from '../ui/Chip'
import { Dropdown } from '../ui/Dropdown'
import { EmptyState } from '../ui/EmptyState'

/**
 * Spend rows for a trip. Booking rows are read-only (edit them in Bookings) so costs are never
 * duplicated. `rows` come from getSpendRows, amounts converted to `currency`.
 */
export function ExpenseList({ rows, currency, onAdd, onEdit, onDelete }) {
  const sorted = [...rows].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold">Expenses</h3>
        <Button size="sm" onClick={onAdd}>
          <Plus size={14} aria-hidden="true" /> Add expense
        </Button>
      </div>
      {sorted.length === 0 ? (
        <EmptyState icon={Receipt} title="No spending yet" message="Log expenses as you go. They convert to your trip currency automatically." />
      ) : (
        <ul className="divide-y divide-border rounded-card border border-border bg-surface">
          <AnimatePresence initial={false}>
            {sorted.map((row) => {
              const category = expenseCategories[row.category]
              const foreign = row.original.currency !== currency
              return (
                <motion.li key={row.id} {...listItem} className="flex items-center gap-3 px-4 py-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted">
                    <category.icon size={16} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{row.title}</p>
                    <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted">
                      {category.label} · {formatDate(row.date, { day: 'numeric', month: 'short' })}
                      {row.fromBooking && (
                        <Chip icon={Ticket} className="!py-0.5">
                          From booking
                        </Chip>
                      )}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold">{formatMoney(row.converted, currency)}</p>
                    {foreign && <p className="text-xs text-muted">{formatMoney(row.original.amount, row.original.currency)}</p>}
                  </div>
                  {row.fromBooking ? (
                    <span className="w-8" />
                  ) : (
                    <Dropdown
                      label={`Actions for ${row.title}`}
                      items={[
                        { label: 'Edit', icon: Pencil, onSelect: () => onEdit(row.id) },
                        { label: 'Delete', icon: Trash2, danger: true, onSelect: () => onDelete(row.id) },
                      ]}
                      trigger={(props) => (
                        <Button {...props} variant="ghost" size="sm" icon>
                          <MoreHorizontal size={16} aria-hidden="true" />
                        </Button>
                      )}
                    />
                  )}
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}
