/**
 * Format minor units (e.g. kobo) as a plain amount: "5,000". No currency
 * symbol. 0 becomes "Free". `currency` is kept so callers need not change.
 */
export function formatPrice(
  minor: number | undefined,
  _currency = 'NGN',
): string | null {
  if (minor === undefined) return null
  if (minor === 0) return 'Free'
  const amount = minor / 100
  return new Intl.NumberFormat('en', {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}
