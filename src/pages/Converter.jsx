import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeftRight, History, Info } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Chip } from '../components/ui/Chip'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { currencies } from '../data/rates'
import { getRates } from '../services/currency'
import { useConverter } from '../hooks/useConverter'
import { useCountUp } from '../hooks/useCountUp'
import { convert } from '../lib/money'
import { spring } from '../lib/motion'
import { useTripStore } from '../store/useTripStore'

const options = currencies.map((c) => ({ value: c.code, label: c.code, hint: c.name }))
const nameOf = Object.fromEntries(currencies.map((c) => [c.code, c.name]))
const number = (value, max = 2) => new Intl.NumberFormat(undefined, { maximumFractionDigits: value < 10 ? max : 0 }).format(value)

export default function Converter() {
  const { rates, amount, setAmount, from, setFrom, to, setTo, valid, result, unitRate, swap } = useConverter()
  const overrides = useTripStore((s) => s.settings.rateOverrides)
  const recent = useTripStore((s) => s.recentConversions)
  const addRecentConversion = useTripStore((s) => s.addRecentConversion)
  const [turns, setTurns] = useState(0)
  const [updated, setUpdated] = useState('')
  const rolling = useCountUp(result, { duration: 500 })
  const numeric = Number(amount)

  useEffect(() => {
    getRates('USD').then((r) => setUpdated(r.lastUpdated))
  }, [])

  // Save a conversion to "recent" once the user pauses on it.
  useEffect(() => {
    if (!valid || numeric <= 0) return undefined
    const timer = setTimeout(() => addRecentConversion({ amount: numeric, from, to }), 1500)
    return () => clearTimeout(timer)
  }, [valid, numeric, from, to, addRecentConversion])

  const apply = (c) => {
    setAmount(String(c.amount))
    setFrom(c.from)
    setTo(c.to)
  }

  return (
    <PageShell title="Currency converter" subtitle="Works offline with built-in rates">
      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <Card className="space-y-6">
          <Input
            label="Amount"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={!valid ? 'Enter an amount of zero or more.' : undefined}
            className="max-w-xs"
          />
          <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <Select label="From" options={options} value={from} onChange={setFrom} />
            <motion.span animate={{ rotate: turns * 180 }} transition={spring} className="justify-self-center">
              <Button
                variant="secondary"
                icon
                aria-label="Swap currencies"
                onClick={() => {
                  swap()
                  setTurns((t) => t + 1)
                }}
              >
                <ArrowLeftRight size={16} aria-hidden="true" />
              </Button>
            </motion.span>
            <Select label="To" options={options} value={to} onChange={setTo} />
          </div>

          <div className="rounded-card bg-blue/60 p-6 dark:bg-blue/40" aria-live="polite">
            <p className="text-sm text-muted">
              {valid ? `${number(numeric)} ${from} (${nameOf[from]}) =` : 'Converted amount'}
            </p>
            <p className="font-heading text-4xl font-extrabold tabular-nums">{valid ? `${number(rolling)} ${to}` : '—'}</p>
            <p className="mt-1 text-sm text-muted">{nameOf[to]}</p>
            <p className="mt-4 text-sm font-semibold">
              1 {from} = {number(unitRate, 4)} {to}
            </p>
            <p className="text-xs text-muted">
              1 {to} = {number(1 / unitRate, 4)} {from}
            </p>
          </div>

          <p className="flex items-start gap-2 text-xs text-muted">
            <Info size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
            <span>
              {updated}. You can override any rate in{' '}
              <Link to="/settings" className="font-semibold text-primary hover:underline">
                Settings
              </Link>
              .
            </span>
          </p>
        </Card>

        <div className="space-y-5">
          <Card>
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold">
              <History size={16} aria-hidden="true" /> Recent conversions
            </h2>
            {recent.length === 0 ? (
              <p className="text-sm text-muted">Conversions you pause on will appear here.</p>
            ) : (
              <ul className="space-y-1">
                {recent.map((c) => (
                  <li key={`${c.amount}-${c.from}-${c.to}`}>
                    <button
                      type="button"
                      onClick={() => apply(c)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-surface-2"
                    >
                      <span className="font-semibold">
                        {number(c.amount)} {c.from} → {c.to}
                      </span>
                      <span className="tabular-nums text-muted">
                        {number(convert(c.amount, c.from, c.to, rates))} {c.to}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 text-base font-bold">1 {from} in other currencies</h2>
            <ul className="max-h-72 space-y-1 overflow-y-auto pr-1">
              {currencies
                .filter((c) => c.code !== from)
                .map((c) => (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => setTo(c.code)}
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-surface-2"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-semibold">{c.code}</span>
                        {overrides[c.code] && <Chip tone="accent" className="!py-0">Custom</Chip>}
                      </span>
                      <span className="tabular-nums text-muted">{number(convert(1, from, c.code, rates), 4)}</span>
                    </button>
                  </li>
                ))}
            </ul>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
