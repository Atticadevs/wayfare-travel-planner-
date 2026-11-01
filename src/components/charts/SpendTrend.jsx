import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { format } from 'date-fns'
import { parseDate } from '../../lib/dates'
import { formatMoney } from '../../lib/format'

const tick = { fill: 'rgb(var(--text-muted))', fontSize: 11 }

const monthLabel = (key) => format(parseDate(`${key}-01`), 'MMM yy')

function TripDot({ cx, cy, payload }) {
  if (!payload.tripMonth) return null
  return <circle cx={cx} cy={cy} r={5} fill="rgb(var(--accent))" stroke="rgb(var(--surface))" strokeWidth={2} />
}

/** Monthly spend area chart. Months in which a trip starts get an accent dot. */
export function SpendTrend({ data, tripMonths, currency }) {
  const points = data.map((d) => ({ ...d, label: monthLabel(d.key), tripMonth: tripMonths.has(d.key) }))
  const summary = `Monthly spend trend: ${points.map((p) => `${p.label} ${formatMoney(p.amount, currency)}`).join(', ')}. Dots mark months with a trip.`

  return (
    <div role="img" aria-label={summary} tabIndex={0} className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={points} margin={{ top: 12, right: 12, bottom: 0, left: 0 }} accessibilityLayer={false}>
          <defs>
            <linearGradient id="spend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity={0.35} />
              <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgb(var(--border))" />
          <XAxis dataKey="label" tick={tick} tickLine={false} axisLine={false} />
          <YAxis tick={tick} tickLine={false} axisLine={false} width={48} tickFormatter={(v) => formatMoney(v, currency, { compact: true })} />
          <Tooltip
            cursor={{ stroke: 'rgb(var(--text-muted))', strokeDasharray: 4 }}
            contentStyle={{
              background: 'rgb(var(--surface))',
              border: '1px solid rgb(var(--border))',
              borderRadius: 12,
              color: 'rgb(var(--text))',
              fontSize: 12,
            }}
            formatter={(value) => [formatMoney(value, currency), 'Spent']}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="rgb(var(--primary))"
            strokeWidth={2.5}
            fill="url(#spend-fill)"
            dot={<TripDot />}
            activeDot={{ r: 6 }}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
