// Static offline rates, USD base: 1 USD = rates[code] units of that currency.
// Replace by a live source behind getRates() in services/currency.js.

export const RATES_BASE = 'USD'
export const RATES_LAST_UPDATED = 'Offline rates, updated manually'

export const rates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.6725,
  SAR: 3.75,
  QAR: 3.64,
  MYR: 4.45,
  THB: 35.5,
  JPY: 150,
  TRY: 41,
  INR: 84,
  CNY: 7.2,
  SGD: 1.34,
  CAD: 1.37,
  AUD: 1.52,
  IDR: 15800,
  VND: 25000,
  KRW: 1380,
  CHF: 0.88,
  PKR: 278.5,
}

export const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'QAR', name: 'Qatari Riyal' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'TRY', name: 'Turkish Lira' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'VND', name: 'Vietnamese Dong' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'PKR', name: 'Pakistani Rupee' },
]
