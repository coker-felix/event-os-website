/** URL filters for the vendors pages. Anything invalid is dropped. */

export interface CalloutsSearch {
  category?: string
  city?: string
  page?: number
}

/** Trimmed text from a string, or from a number (the router parses ?x=7 as 7). */
function text(v: unknown): string | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  if (typeof v === 'string' && v.trim()) return v.trim()
  return undefined
}

/** A page number above 1. Page 1 is the default, so it is left out. */
function page(v: unknown): number | undefined {
  const n = typeof v === 'string' || typeof v === 'number' ? Number(v) : NaN
  return Number.isInteger(n) && n > 1 ? n : undefined
}

export function validateCalloutsSearch(raw: Record<string, unknown>): CalloutsSearch {
  const out: CalloutsSearch = {}
  const category = text(raw.category)
  if (category) out.category = category
  const city = text(raw.city)
  if (city) out.city = city
  const p = page(raw.page)
  if (p) out.page = p
  return out
}
