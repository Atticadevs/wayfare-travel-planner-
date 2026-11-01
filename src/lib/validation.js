/** Returns { field: message } for an invalid trip form; empty object when valid. */
export function validateTrip(v) {
  const errors = {}
  if (!v.title.trim()) errors.title = 'Give your trip a name.'
  if (!v.destination.trim()) errors.destination = 'Where are you going?'
  if (!v.country.trim()) errors.country = 'Add the country.'
  if (v.countryCode && !/^[A-Za-z]{2}$/.test(v.countryCode)) errors.countryCode = 'Use a 2-letter code, like MY.'
  if (!v.startDate || !v.endDate) errors.dates = 'Choose your start and end dates.'
  else if (v.endDate < v.startDate) errors.dates = 'The end date can’t be before the start date.'
  const amount = Number(v.budgetAmount)
  if (!v.budgetAmount || !Number.isFinite(amount) || amount <= 0) errors.budgetAmount = 'Enter a budget greater than zero.'
  const travelers = Number(v.travelers)
  if (!Number.isInteger(travelers) || travelers < 1) errors.travelers = 'At least one traveler.'
  return errors
}
