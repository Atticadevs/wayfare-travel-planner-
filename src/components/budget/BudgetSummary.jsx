import { differenceInCalendarDays } from 'date-fns'
import { CircleAlert, CircleCheck, TriangleAlert } from 'lucide-react'
import { formatMoney } from '../../lib/format'
import { parseDate, tripDayCount } from '../../lib/dates'
import { cn } from '../../lib/cn'
import { sumByCategory } from '../../store/selectors'
import { BudgetGauge, gaugeTone } from '../charts/BudgetGauge'
import { CategoryCapsule } from '../charts/CategoryCapsule'
import { Card } from '../ui/Card'

const banners = {
  success: { icon: CircleCheck, className: 'bg-success/15 text-success-fg' },
  warning: { icon: CircleAlert, className: 'bg-warning/20 text-warning-fg' },
  danger: { icon: TriangleAlert, className: 'bg-danger/15 text-danger-fg' },
}

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="text-base font-bold">{value}</dd>
    </div>
  )
}

/** Gauge, remaining, per-day average, projected overspend and category breakdown for one trip. */
export function BudgetSummary({ trip, rows }) {
  const { amount: budget, currency } = trip.budget
  const spent = rows.reduce((sum, r) => sum + r.converted, 0)
  const ratio = budget > 0 ? spent / budget : 0
  const tone = gaugeTone(ratio)
  const days = tripDayCount(trip)
  const elapsed = Math.min(days, differenceInCalendarDays(new Date(), parseDate(trip.startDate)) + 1)
  const started = elapsed >= 1

  const bookingSpend = rows.filter((r) => r.fromBooking).reduce((sum, r) => sum + r.converted, 0)
  const dailySpend = started ? (spent - bookingSpend) / elapsed : 0
  const projected = started && elapsed < days ? bookingSpend + dailySpend * days : spent
  const willOverspend = started && elapsed < days && projected > budget && spent <= budget

  const message = {
    success: `You’re on track: ${Math.round(ratio * 100)}% of the budget used.`,
    warning: `Heads up: you’ve used ${Math.round(ratio * 100)}% of your budget.`,
    danger: `You’re ${formatMoney(spent - budget, currency)} over budget. Time to review.`,
  }[tone]
  const Banner = banners[tone]

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="space-y-4">
        <h3 className="text-base font-bold">Budget</h3>
        <BudgetGauge spent={spent} budget={budget} currency={currency} className="mx-auto w-full max-w-xs" />
        <dl className="grid grid-cols-3 gap-3 text-center">
          <Stat label="Spent" value={formatMoney(spent, currency)} />
          <Stat label="Budget" value={formatMoney(budget, currency)} />
          <Stat label={started ? 'Per day' : 'Planned / day'} value={formatMoney(started ? spent / elapsed : budget / days, currency)} />
        </dl>
        <p role="status" className={cn('flex items-start gap-2 rounded-control px-3 py-2 text-xs font-semibold', banners[tone].className)}>
          <Banner.icon size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
          {message}
        </p>
        {willOverspend && (
          <p className="flex items-start gap-2 rounded-control bg-warning/20 px-3 py-2 text-xs font-semibold text-warning-fg">
            <TriangleAlert size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
            At this pace you may finish about {formatMoney(projected - budget, currency)} over budget.
          </p>
        )}
      </Card>
      <Card className="space-y-4">
        <h3 className="text-base font-bold">Where it went</h3>
        <CategoryCapsule totals={sumByCategory(rows)} currency={currency} />
      </Card>
    </div>
  )
}
