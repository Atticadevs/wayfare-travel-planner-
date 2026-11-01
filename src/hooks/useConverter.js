import { useMemo, useState } from 'react'
import { convert } from '../lib/money'
import { useTripStore } from '../store/useTripStore'
import { useRates } from './useRates'

/** Shared converter state for the dashboard widget and the Converter page. */
export function useConverter() {
  const rates = useRates()
  const baseCurrency = useTripStore((s) => s.settings.baseCurrency)
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState(baseCurrency)
  const [to, setTo] = useState(baseCurrency === 'EUR' ? 'USD' : 'EUR')

  const numeric = Number(amount)
  const valid = amount !== '' && Number.isFinite(numeric) && numeric >= 0
  const result = useMemo(() => (valid ? convert(numeric, from, to, rates) : 0), [valid, numeric, from, to, rates])
  const unitRate = useMemo(() => convert(1, from, to, rates), [from, to, rates])

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  return { rates, amount, setAmount, from, setFrom, to, setTo, valid, result, unitRate, swap }
}
