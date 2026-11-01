import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PiggyBank, Receipt, Wallet, X } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { BudgetVsActual } from '../components/charts/BudgetVsActual'
import { CategoryCapsule } from '../components/charts/CategoryCapsule'
import { ChartCard } from '../components/charts/ChartCard'
import { SpendTrend } from '../components/charts/SpendTrend'
import { StatCard } from '../components/dashboard/StatCard'
import { TripBudgetTable } from '../components/budget/TripBudgetTable'
import { Button } from '../components/ui/Button'
import { DateRangePicker } from '../components/ui/DateRangePicker'
import { useNow } from '../hooks/useNow'
import { useRates } from '../hooks/useRates'
import { formatMoney } from '../lib/format'
import { staggerContainer, staggerItem } from '../lib/motion'
import { statusFilters, statusMeta } from '../lib/status'
import { cn } from '../lib/cn'
import { getSpendByMonth, getSpendRowsIn, getTripFinancials, sumByCategory } from '../store/selectors'
import { useTripStore } from '../store/useTripStore'

const emptyRange = { start: '', end: '' }

export default function BudgetPage() {
  const now = useNow(60000)
  const rates = useRates()
  const base = useTripStore((s) => s.settings.baseCurrency)
  const trips = useTripStore((s) => s.trips)
  const bookings = useTripStore((s) => s.bookings)
  const expenses = useTripStore((s) => s.expenses)
  const [status, setStatus] = useState('all')
  const [range, setRange] = useState(emptyRange)

  const financials = useMemo(() => getTripFinancials(trips, bookings, expenses, rates, base, now), [trips, bookings, expenses, rates, base, now])

  const filtered = useMemo(
    () =>
      financials.filter(
        ({ trip, status: s }) =>
          (status === 'all' || s === status) && (!range.start || !range.end || (trip.startDate <= range.end && trip.endDate >= range.start)),
      ),
    [financials, status, range],
  )
  const filteredTrips = useMemo(() => filtered.map((f) => f.trip), [filtered])

  const rows = useMemo(() => getSpendRowsIn(filteredTrips, bookings, expenses, rates, base), [filteredTrips, bookings, expenses, rates, base])
  const planned = filtered.reduce((sum, f) => sum + f.budget, 0)
  const spent = filtered.reduce((sum, f) => sum + f.spent, 0)
  const monthly = useMemo(() => getSpendByMonth(rows), [rows])
  const tripMonths = useMemo(() => new Set(filteredTrips.map((t) => t.startDate.slice(0, 7))), [filteredTrips])
  const money = (n) => formatMoney(n, base)

  const chips = [{ id: 'all', label: 'All' }, ...statusFilters.map((id) => ({ id, label: statusMeta[id].label }))]

  return (
    <PageShell title="Budget" subtitle={`Planned vs spent across your trips, in ${base}`}>
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
          {chips.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={status === id}
              onClick={() => setStatus(id)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                status === id ? 'border-primary bg-primary text-on-primary' : 'border-border bg-surface text-muted hover:text-text',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex w-full items-end gap-2 sm:ml-auto sm:w-auto">
          <div className="min-w-0 flex-1 sm:w-56 sm:flex-none">
            <DateRangePicker label="Date range" start={range.start} end={range.end} onChange={setRange} />
          </div>
          {range.start && (
            <Button variant="ghost" size="sm" icon aria-label="Clear date range" onClick={() => setRange(emptyRange)}>
              <X size={16} aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 gap-5 lg:grid-cols-6 xl:gap-6">
        <motion.div variants={staggerItem} className="min-w-0 lg:col-span-2">
          <StatCard label="Planned" value={planned} format={money} icon={Wallet} tone="primary" caption={`${filtered.length} trip${filtered.length === 1 ? '' : 's'}`} />
        </motion.div>
        <motion.div variants={staggerItem} className="min-w-0 lg:col-span-2">
          <StatCard label="Spent" value={spent} format={money} icon={Receipt} tone="accent" caption={planned > 0 ? `${Math.round((spent / planned) * 100)}% of planned` : 'No budget set'} />
        </motion.div>
        <motion.div variants={staggerItem} className="min-w-0 lg:col-span-2">
          <StatCard label="Remaining" value={planned - spent} format={money} icon={PiggyBank} tone="success" caption={planned - spent < 0 ? 'Over budget overall' : 'Still available'} />
        </motion.div>

        <motion.div variants={staggerItem} className="min-w-0 lg:col-span-3">
          <ChartCard title="Spending by category" subtitle="Expenses and booking costs" empty={rows.length === 0 && 'No spending in this selection.'}>
            <CategoryCapsule totals={sumByCategory(rows)} currency={base} />
          </ChartCard>
        </motion.div>
        <motion.div variants={staggerItem} className="min-w-0 lg:col-span-3">
          <ChartCard title="Budget vs actual" subtitle="Per trip" empty={filtered.length === 0 && 'No trips match these filters.'}>
            <BudgetVsActual rows={[...filtered].sort((a, b) => a.trip.startDate.localeCompare(b.trip.startDate))} currency={base} />
          </ChartCard>
        </motion.div>

        <motion.div variants={staggerItem} className="min-w-0 lg:col-span-6">
          <ChartCard title="Monthly spend" subtitle="Dots mark months a trip starts" empty={monthly.length === 0 && 'Spending will chart here once you log some.'}>
            <SpendTrend data={monthly} tripMonths={tripMonths} currency={base} />
          </ChartCard>
        </motion.div>

        <motion.div variants={staggerItem} className="min-w-0 lg:col-span-6">
          <ChartCard title="All trips" subtitle="Click a column to sort" empty={filtered.length === 0 && 'No trips match these filters.'}>
            <TripBudgetTable rows={filtered} currency={base} />
          </ChartCard>
        </motion.div>
      </motion.div>
    </PageShell>
  )
}
