import { rates, RATES_BASE, RATES_LAST_UPDATED } from '../data/rates'

/**
 * Returns { base, rates, lastUpdated } with `rates` expressed against `base`.
 * Static today; replace the body with a live exchange-rate API call later,
 * keeping this return shape so no caller changes.
 */
export async function getRates(base = RATES_BASE) {
  const baseRate = rates[base] ?? 1
  const rebased = Object.fromEntries(Object.entries(rates).map(([code, value]) => [code, value / baseRate]))
  return { base, rates: rebased, lastUpdated: RATES_LAST_UPDATED }
}
