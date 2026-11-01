import { formatMoney } from '../../lib/format'
import { BudgetGauge } from '../charts/BudgetGauge'
import { ChartCard } from '../charts/ChartCard'

/** Planned vs spent across active trips, in the base currency. */
export function BudgetOverview({ planned, spent, currency, tripCount }) {
  return (
    <ChartCard
      title="Budget overview"
      subtitle={`${tripCount} active trip${tripCount === 1 ? '' : 's'}`}
      empty={tripCount === 0 && 'Active trips will show their combined budget here.'}
    >
      <BudgetGauge spent={spent} budget={planned} currency={currency} className="mx-auto w-full max-w-[14rem]" />
      <dl className="mt-3 grid grid-cols-2 gap-3 text-center">
        <div>
          <dt className="text-xs text-muted">Planned</dt>
          <dd className="text-sm font-bold">{formatMoney(planned, currency)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Spent</dt>
          <dd className="text-sm font-bold">{formatMoney(spent, currency)}</dd>
        </div>
      </dl>
    </ChartCard>
  )
}
