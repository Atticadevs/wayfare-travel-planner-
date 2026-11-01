import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { formatMoney } from '../../lib/format'
import { statusMeta } from '../../lib/status'
import { cn } from '../../lib/cn'
import { gaugeTone } from '../charts/BudgetGauge'
import { Chip } from '../ui/Chip'
import { ProgressBar } from '../ui/ProgressBar'

const columns = [
  { key: 'title', label: 'Trip', value: (r) => r.trip.title },
  { key: 'status', label: 'Status', value: (r) => r.status },
  { key: 'budget', label: 'Budget', value: (r) => r.budget, numeric: true },
  { key: 'spent', label: 'Spent', value: (r) => r.spent, numeric: true },
  { key: 'remaining', label: 'Remaining', value: (r) => r.budget - r.spent, numeric: true },
  { key: 'used', label: 'Used', value: (r) => (r.budget > 0 ? r.spent / r.budget : 0), numeric: true },
]

/** Sortable per-trip budget table with usage bars. Rows are { trip, status, budget, spent } in `currency`. */
export function TripBudgetTable({ rows, currency }) {
  const [sort, setSort] = useState({ key: 'used', dir: 'desc' })

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sort.key)
    const factor = sort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const x = col.value(a)
      const y = col.value(b)
      return (typeof x === 'string' ? x.localeCompare(y) : x - y) * factor
    })
  }, [rows, sort])

  const toggle = (key) => setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'title' || key === 'status' ? 'asc' : 'desc' }))

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted">
            {columns.map((c) => {
              const active = sort.key === c.key
              const Icon = active ? (sort.dir === 'asc' ? ArrowUp : ArrowDown) : ChevronsUpDown
              return (
                <th key={c.key} scope="col" aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={cn('py-2 pr-3', c.numeric && 'text-right')}>
                  <button type="button" onClick={() => toggle(c.key)} className={cn('inline-flex items-center gap-1 rounded font-semibold hover:text-text', active && 'text-text')}>
                    {c.label}
                    <Icon size={12} aria-hidden="true" />
                  </button>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map(({ trip, status, budget, spent }) => {
            const ratio = budget > 0 ? spent / budget : 0
            const meta = statusMeta[status]
            return (
              <tr key={trip.id} className="border-b border-border last:border-0">
                <td className="py-3 pr-3 font-semibold">
                  <Link to={`/trips/${trip.id}`} className="hover:underline">
                    {trip.title}
                  </Link>
                </td>
                <td className="py-3 pr-3">
                  <Chip tone={meta.tone} icon={meta.icon}>
                    {meta.label}
                  </Chip>
                </td>
                <td className="py-3 pr-3 text-right tabular-nums">{formatMoney(budget, currency)}</td>
                <td className="py-3 pr-3 text-right tabular-nums">{formatMoney(spent, currency)}</td>
                <td className={cn('py-3 pr-3 text-right tabular-nums', budget - spent < 0 && 'font-semibold text-danger-fg')}>
                  {formatMoney(budget - spent, currency)}
                </td>
                <td className="w-40 py-3">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={ratio * 100} tone={gaugeTone(ratio)} label={`${trip.title} budget used`} className="flex-1" />
                    <span className="w-10 text-right text-xs tabular-nums text-muted">{Math.round(ratio * 100)}%</span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
