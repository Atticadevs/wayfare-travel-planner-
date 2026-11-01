import { useEffect, useMemo, useState } from 'react'
import { rates as staticRates } from '../data/rates'
import { getRates } from '../services/currency'
import { useTripStore } from '../store/useTripStore'

/** USD-based rates table with manual overrides applied. Starts from the static table so it never blocks. */
export function useRates() {
  const overrides = useTripStore((s) => s.settings.rateOverrides)
  const [table, setTable] = useState(staticRates)

  useEffect(() => {
    let live = true
    getRates('USD').then((r) => live && setTable(r.rates))
    return () => {
      live = false
    }
  }, [])

  return useMemo(() => ({ ...table, ...overrides }), [table, overrides])
}
