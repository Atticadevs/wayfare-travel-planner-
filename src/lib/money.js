/**
 * Converts between currencies using a rates table where every value is
 * "units of that currency per 1 unit of the table's base" (works for any base).
 * Unknown currencies pass through unconverted.
 */
export function convert(amount, from, to, rateTable) {
  if (from === to) return amount
  const fromRate = rateTable[from]
  const toRate = rateTable[to]
  if (!fromRate || !toRate) return amount
  return (amount / fromRate) * toRate
}
