/** Format minor units (e.g. kobo) as a price: "₦5,000". 0 becomes "Free". */
export function formatPrice(
  minor: number | undefined,
  currency = 'NGN',
): string | null {
  if (minor === undefined) return null
  if (minor === 0) return 'Free'
  const amount = minor / 100
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString('en')}`
  }
}
