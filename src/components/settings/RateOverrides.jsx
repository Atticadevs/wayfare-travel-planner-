import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { currencies, rates as defaultRates } from '../../data/rates'
import { useTripStore } from '../../store/useTripStore'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

const options = currencies.filter((c) => c.code !== 'USD').map((c) => ({ value: c.code, label: c.code, hint: c.name }))

/** Manual rate overrides, expressed as units of currency per 1 USD. Stored in settings. */
export function RateOverrides() {
  const overrides = useTripStore((s) => s.settings.rateOverrides)
  const updateSettings = useTripStore((s) => s.updateSettings)
  const [code, setCode] = useState('PKR')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const add = (e) => {
    e.preventDefault()
    const rate = Number(value)
    if (!value || !Number.isFinite(rate) || rate <= 0) {
      setError('Enter a rate greater than zero.')
      return
    }
    setError('')
    updateSettings({ rateOverrides: { ...overrides, [code]: rate } })
    setValue('')
  }

  const remove = (key) => {
    updateSettings({ rateOverrides: Object.fromEntries(Object.entries(overrides).filter(([k]) => k !== key)) })
  }

  const entries = Object.entries(overrides)

  return (
    <div className="space-y-4">
      <form onSubmit={add} noValidate className="flex flex-wrap items-start gap-3">
        <Select ariaLabel="Currency to override" className="w-32" options={options} value={code} onChange={setCode} />
        <Input
          aria-label="Rate per 1 USD"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          placeholder={`1 USD = ${defaultRates[code]} ${code}`}
          value={value}
          error={error}
          onChange={(e) => setValue(e.target.value)}
          className="min-w-[12rem] flex-1"
        />
        <Button type="submit" variant="secondary">
          <Plus size={16} aria-hidden="true" /> Set rate
        </Button>
      </form>

      {entries.length === 0 ? (
        <p className="text-sm text-muted">No custom rates. Built-in offline rates are used.</p>
      ) : (
        <ul className="divide-y divide-border rounded-control border border-border">
          {entries.map(([key, rate]) => (
            <li key={key} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <span>
                <span className="font-semibold">1 USD = {rate} {key}</span>
                <span className="ml-2 text-xs text-muted">default {defaultRates[key]}</span>
              </span>
              <Button variant="ghost" size="sm" icon aria-label={`Remove custom rate for ${key}`} onClick={() => remove(key)}>
                <X size={14} aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
