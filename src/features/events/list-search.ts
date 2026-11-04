import { dayKey, matchesQuery, matchesQuick } from './filters'
import { startsWithinWeek, toDate } from './format'
import type { PublicEvent } from './types'

export type PriceBandId = 'free' | 'u10' | '10-25' | 'o25'
export type EventFormat = 'in_person' | 'virtual' | 'hybrid'
export type WhenOption = 'tonight' | 'weekend' | 'week' | 'range'
export type EventsSort = 'soonest' | 'newest' | 'price'

/** Bands in minor units (kobo). Placeholders: set to typical ticket prices. */
export const PRICE_BANDS: ReadonlyArray<{
  id: PriceBandId
  label: string
  min: number
  max: number
}> = [
  { id: 'free', label: 'Free', min: 0, max: 0 },
  { id: 'u10', label: 'Under ₦10k', min: 1, max: 999_999 },
  { id: '10-25', label: '₦10k to ₦25k', min: 1_000_000, max: 2_500_000 },
  { id: 'o25', label: 'Over ₦25k', min: 2_500_001, max: Infinity },
]

export const FORMAT_LABELS: Record<EventFormat, string> = {
  in_person: 'In person',
  virtual: 'Online',
  hybrid: 'In person + online',
}

export const WHEN_LABELS: Record<Exclude<WhenOption, 'range'>, string> = {
  tonight: 'Tonight',
  weekend: 'This weekend',
  week: 'Next 7 days',
}

export const PAGE_SIZE = 12

export interface EventsSearch {
  q?: string
  cities?: Array<string>
  when?: WhenOption
  /** YYYY-MM-DD, used with `when: 'range'`. */
  from?: string
  to?: string
  prices?: Array<PriceBandId>
  cats?: Array<number>
  formats?: Array<EventFormat>
  sort?: EventsSort
  view?: 'grid' | 'list'
  page?: number
}

const BAND_IDS = PRICE_BANDS.map((b) => b.id)
const FORMATS: Array<EventFormat> = ['in_person', 'virtual', 'hybrid']
const WHENS: Array<WhenOption> = ['tonight', 'weekend', 'week', 'range']
const SORTS: Array<EventsSort> = ['soonest', 'newest', 'price']

function list(raw: unknown): Array<string> {
  const items = Array.isArray(raw)
    ? raw.map(String)
    : typeof raw === 'string'
      ? raw.split(',')
      : []
  return items.map((s) => s.trim()).filter(Boolean)
}

function only<T extends string>(raw: unknown, allowed: Array<T>): Array<T> {
  return list(raw).filter((x): x is T => (allowed as Array<string>).includes(x))
}

function isoDay(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return undefined
  const d = new Date(`${raw}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(raw)
    ? raw
    : undefined
}

/** Turn whatever is in the URL into a safe search; invalid values vanish. */
export function validateEventsSearch(raw: Record<string, unknown>): EventsSearch {
  const out: EventsSearch = {}
  if (typeof raw.q === 'string' && raw.q.trim()) out.q = raw.q.trim()
  const cities = list(raw.cities)
  if (cities.length) out.cities = cities
  if (WHENS.includes(raw.when as WhenOption)) out.when = raw.when as WhenOption
  const from = isoDay(raw.from)
  if (from) out.from = from
  const to = isoDay(raw.to)
  if (to) out.to = to
  const prices = only(raw.prices, BAND_IDS)
  if (prices.length) out.prices = prices
  const cats = list(raw.cats)
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0)
  if (cats.length) out.cats = cats
  const formats = only(raw.formats, FORMATS)
  if (formats.length) out.formats = formats
  if (SORTS.includes(raw.sort as EventsSort)) out.sort = raw.sort as EventsSort
  if (raw.view === 'grid' || raw.view === 'list') out.view = raw.view
  const page = Number(raw.page)
  if (Number.isInteger(page) && page >= 1) out.page = page
  return out
}

type Facet = 'q' | 'cities' | 'when' | 'prices' | 'cats' | 'formats'

function matchesWhen(
  e: PublicEvent,
  s: EventsSearch,
  when: WhenOption,
  now: number,
): boolean {
  if (when === 'tonight' || when === 'weekend') return matchesQuick(e, when, now)
  if (when === 'week') return startsWithinWeek(e, now)
  const start = toDate(e.startsAt)
  if (!start) return false
  const day = dayKey(start, e.timezone)
  if (s.from && day < s.from) return false
  if (s.to && day > s.to) return false
  return true
}

function inBand(e: PublicEvent, id: PriceBandId): boolean {
  const band = PRICE_BANDS.find((b) => b.id === id)
  const p = e.priceFromMinor
  return !!band && p !== undefined && p >= band.min && p <= band.max
}

function passes(
  e: PublicEvent,
  s: EventsSearch,
  names: Map<number, string>,
  now: number,
  skip?: Facet,
): boolean {
  if (skip !== 'cities' && s.cities?.length && !s.cities.includes(e.city ?? ''))
    return false
  if (skip !== 'cats' && s.cats?.length && !s.cats.includes(e.categoryId ?? -1))
    return false
  if (
    skip !== 'formats' &&
    s.formats?.length &&
    !s.formats.includes(e.attendanceType as EventFormat)
  )
    return false
  if (skip !== 'prices' && s.prices?.length && !s.prices.some((id) => inBand(e, id)))
    return false
  if (skip !== 'when' && s.when && !matchesWhen(e, s, s.when, now)) return false
  if (
    skip !== 'q' &&
    s.q &&
    !matchesQuery(e, s.q, e.categoryId ? names.get(e.categoryId) : undefined)
  )
    return false
  return true
}

function time(ts: number | string | undefined): number | null {
  return toDate(ts)?.getTime() ?? null
}

/** Filter, then sort (default soonest). Unknown values always sort last. */
export function applyEventsSearch(
  events: Array<PublicEvent>,
  s: EventsSearch,
  names: Map<number, string>,
  now: number,
): Array<PublicEvent> {
  const kept = events.filter((e) => passes(e, s, names, now))
  const sort = s.sort ?? 'soonest'
  const key = (e: PublicEvent): number | null =>
    sort === 'price'
      ? (e.priceFromMinor ?? null)
      : sort === 'newest'
        ? time(e.createdAt)
        : time(e.startsAt)
  const dir = sort === 'newest' ? -1 : 1
  return [...kept].sort((a, b) => {
    const ka = key(a)
    const kb = key(b)
    if (ka === null && kb === null) return 0
    if (ka === null) return 1
    if (kb === null) return -1
    return (ka - kb) * dir
  })
}

export interface FacetCounts {
  cities: Map<string, number>
  categories: Map<number, number>
  formats: Map<string, number>
  prices: Map<PriceBandId, number>
  when: Record<'tonight' | 'weekend' | 'week', number>
}

function bump<TKey>(m: Map<TKey, number>, k: TKey | undefined) {
  if (k !== undefined) m.set(k, (m.get(k) ?? 0) + 1)
}

/** Each option's count covers events matching every filter except its own facet. */
export function facetCounts(
  events: Array<PublicEvent>,
  s: EventsSearch,
  names: Map<number, string>,
  now: number,
): FacetCounts {
  const ignoring = (facet: Facet) =>
    events.filter((e) => passes(e, s, names, now, facet))
  const cities = new Map<string, number>()
  ignoring('cities').forEach((e) => bump(cities, e.city))
  const categories = new Map<number, number>()
  ignoring('cats').forEach((e) => bump(categories, e.categoryId))
  const formats = new Map<string, number>()
  ignoring('formats').forEach((e) => bump(formats, e.attendanceType))
  const prices = new Map<PriceBandId, number>()
  const priceBase = ignoring('prices')
  for (const b of PRICE_BANDS) {
    prices.set(b.id, priceBase.filter((e) => inBand(e, b.id)).length)
  }
  const whenBase = ignoring('when')
  const when = {
    tonight: whenBase.filter((e) => matchesWhen(e, s, 'tonight', now)).length,
    weekend: whenBase.filter((e) => matchesWhen(e, s, 'weekend', now)).length,
    week: whenBase.filter((e) => matchesWhen(e, s, 'week', now)).length,
  }
  return { cities, categories, formats, prices, when }
}

export interface FilterChip {
  key: string
  label: string
  remove: (s: EventsSearch) => EventsSearch
}

function without<T extends keyof EventsSearch>(
  s: EventsSearch,
  ...keys: Array<T>
): EventsSearch {
  const next = { ...s }
  delete next.page
  for (const k of keys) delete next[k]
  return next
}

function dropValue<T>(
  s: EventsSearch,
  key: 'cities' | 'prices' | 'cats' | 'formats',
  value: T,
): EventsSearch {
  const rest = ((s[key] ?? []) as Array<T>).filter((v) => v !== value)
  const next = without(s, key)
  return rest.length ? ({ ...next, [key]: rest }) : next
}

/** One removable chip per active filter value. */
export function activeFilterChips(
  s: EventsSearch,
  names: Map<number, string>,
): Array<FilterChip> {
  const chips: Array<FilterChip> = []
  if (s.q)
    chips.push({ key: 'q', label: `“${s.q}”`, remove: (x) => without(x, 'q') })
  for (const c of s.cities ?? [])
    chips.push({ key: `city:${c}`, label: c, remove: (x) => dropValue(x, 'cities', c) })
  if (s.when) {
    const label =
      s.when === 'range'
        ? [s.from, s.to].filter(Boolean).join(' to ') || 'Pick dates'
        : WHEN_LABELS[s.when]
    chips.push({ key: 'when', label, remove: (x) => without(x, 'when', 'from', 'to') })
  }
  for (const id of s.prices ?? []) {
    const label = PRICE_BANDS.find((b) => b.id === id)?.label ?? id
    chips.push({ key: `price:${id}`, label, remove: (x) => dropValue(x, 'prices', id) })
  }
  for (const id of s.cats ?? [])
    chips.push({
      key: `cat:${id}`,
      label: names.get(id) ?? `Category ${id}`,
      remove: (x) => dropValue(x, 'cats', id),
    })
  for (const f of s.formats ?? [])
    chips.push({
      key: `format:${f}`,
      label: FORMAT_LABELS[f],
      remove: (x) => dropValue(x, 'formats', f),
    })
  return chips
}

export function paginate<T>(
  items: Array<T>,
  page = 1,
): { items: Array<T>; hasMore: boolean } {
  const end = Math.max(1, page) * PAGE_SIZE
  return { items: items.slice(0, end), hasMore: items.length > end }
}
