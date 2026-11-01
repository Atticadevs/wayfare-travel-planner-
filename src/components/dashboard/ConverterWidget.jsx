import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeftRight } from 'lucide-react'
import { currencies } from '../../data/rates'
import { useConverter } from '../../hooks/useConverter'
import { useCountUp } from '../../hooks/useCountUp'
import { spring } from '../../lib/motion'
import { cn } from '../../lib/cn'
import { ChartCard } from '../charts/ChartCard'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'

const options = currencies.map((c) => ({ value: c.code, label: c.code, hint: c.name }))
const format = (value, code) => new Intl.NumberFormat(undefined, { maximumFractionDigits: value < 10 ? 2 : 0 }).format(value) + ` ${code}`

/** Compact converter. `presets` are the currencies used across the user's trips. */
export function ConverterWidget({ presets }) {
  const { amount, setAmount, from, setFrom, to, setTo, valid, result, unitRate, swap } = useConverter()
  const [turns, setTurns] = useState(0)
  const rolling = useCountUp(result, { duration: 500 })

  return (
    <ChartCard
      title="Currency converter"
      subtitle="Offline rates"
      action={
        <Link to="/converter" className="text-xs font-semibold text-primary hover:underline">
          Open
        </Link>
      }
    >
      <div className="space-y-3">
        <div>
          <label htmlFor="conv-amount" className="mb-1.5 block text-xs font-semibold text-muted">
            Amount
          </label>
          <input
            id="conv-amount"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={!valid || undefined}
            className={cn(
              'h-10 w-full rounded-control border bg-surface px-3 text-sm font-semibold focus:border-primary',
              valid ? 'border-border' : 'border-danger',
            )}
          />
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <Select ariaLabel="From currency" options={options} value={from} onChange={setFrom} />
          <motion.span animate={{ rotate: turns * 180 }} transition={spring}>
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
          <Select ariaLabel="To currency" options={options} value={to} onChange={setTo} />
        </div>

        <div className="rounded-control bg-blue/60 p-4 dark:bg-blue/40" aria-live="polite">
          <p className="text-xs text-muted">Converted</p>
          <p className="font-heading text-2xl font-extrabold tabular-nums">{valid ? format(rolling, to) : '—'}</p>
          <p className="text-xs text-muted">
            1 {from} = {unitRate.toFixed(unitRate < 10 ? 4 : 2)} {to}
          </p>
        </div>

        {presets.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-semibold text-muted">Your trip currencies</p>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((code) => (
                <button
                  key={code}
                  type="button"
                  aria-pressed={to === code}
                  onClick={() => setTo(code)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                    to === code ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:text-text',
                  )}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ChartCard>
  )
}
