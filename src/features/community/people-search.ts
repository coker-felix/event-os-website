export interface PeopleSearch {
  q?: string
  skill?: string
  country?: string
  city?: string
  availability?: 'unspecified' | 'available' | 'unavailable'
  page?: number
}

function text(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export function validatePeopleSearch(raw: Record<string, unknown>): PeopleSearch {
  const out: PeopleSearch = {}
  for (const key of ['q', 'skill', 'city'] as const) {
    const value = text(raw[key])
    if (value) out[key] = value
  }
  const country = text(raw.country)
  if (country && /^[a-z]{2}$/i.test(country)) out.country = country.toUpperCase()
  const availability = text(raw.availability)
  if (availability === 'unspecified' || availability === 'available' || availability === 'unavailable') {
    out.availability = availability
  }
  const pageValue = raw.page
  const page = typeof pageValue === 'string' || typeof pageValue === 'number' ? Number(pageValue) : NaN
  if (Number.isInteger(page) && page >= 1) out.page = page
  return out
}
