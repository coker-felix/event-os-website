/** URL filters for the venues directory. Anything invalid is dropped. */

export interface VenuesSearch {
  city?: string
  country?: string
  minCapacity?: 100 | 300 | 1000
  bookable?: true
  page?: number
}

/** Trimmed text from a string, or from a number (the router parses ?x=7 as 7). */
function text(v: unknown): string | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  if (typeof v === 'string' && v.trim()) return v.trim()
  return undefined
}

function integer(v: unknown): number | undefined {
  const n = typeof v === 'string' || typeof v === 'number' ? Number(v) : NaN
  return Number.isInteger(n) ? n : undefined
}

export function validateVenuesSearch(raw: Record<string, unknown>): VenuesSearch {
  const out: VenuesSearch = {}
  const city = text(raw.city)
  if (city) out.city = city
  const country = text(raw.country)
  if (country) out.country = country
  const cap = integer(raw.minCapacity)
  if (cap === 100 || cap === 300 || cap === 1000) out.minCapacity = cap
  if (raw.bookable === true || raw.bookable === 'true') out.bookable = true
  const page = integer(raw.page)
  if (page !== undefined && page > 1) out.page = page
  return out
}
