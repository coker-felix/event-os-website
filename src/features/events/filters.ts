import { toDate, zone } from './format'
import type { PublicEvent } from './types'

export type QuickFilter = 'tonight' | 'weekend' | 'free'

export const QUICK_FILTERS: Array<{ id: QuickFilter; label: string }> = [
  { id: 'tonight', label: 'Tonight' },
  { id: 'weekend', label: 'This weekend' },
  { id: 'free', label: 'Free' },
]

export interface EventFilters {
  q?: string
  quick?: QuickFilter
  categoryId?: number
  city?: string
}

const DAY_MS = 24 * 60 * 60 * 1000

/** "2026-11-14" for a moment, as seen in the given time zone. */
function dayKey(date: Date, tz?: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: zone(tz),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function weekday(date: Date, tz?: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: zone(tz),
    weekday: 'short',
  }).format(date)
}

export function matchesQuick(
  e: PublicEvent,
  quick: QuickFilter,
  now: number,
): boolean {
  if (quick === 'free') return e.priceFromMinor === 0
  const start = toDate(e.startsAt)
  if (!start) return false
  if (quick === 'tonight') {
    return dayKey(start, e.timezone) === dayKey(new Date(now), e.timezone)
  }
  // weekend: a Fri/Sat/Sun within the next 7 days
  const ahead = start.getTime() - now
  if (ahead < -DAY_MS || ahead > 7 * DAY_MS) return false
  return ['Fri', 'Sat', 'Sun'].includes(weekday(start, e.timezone))
}

export function matchesQuery(
  e: PublicEvent,
  q: string,
  categoryName?: string,
): boolean {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  const hay = [e.title, e.promoTagline, e.venueName, e.city, categoryName]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return needle.split(/\s+/).every((word) => hay.includes(word))
}

export function filterEvents(
  events: Array<PublicEvent>,
  f: EventFilters,
  categoryNames: Map<number, string>,
  now: number,
): Array<PublicEvent> {
  return events.filter((e) => {
    if (f.city && e.city !== f.city) return false
    if (f.categoryId !== undefined && e.categoryId !== f.categoryId)
      return false
    if (f.quick && !matchesQuick(e, f.quick, now)) return false
    if (
      f.q &&
      !matchesQuery(
        e,
        f.q,
        e.categoryId ? categoryNames.get(e.categoryId) : undefined,
      )
    )
      return false
    return true
  })
}

/** Distinct cities in the events, most events first. */
export function citiesOf(events: Array<PublicEvent>): Array<string> {
  const counts = new Map<string, number>()
  for (const e of events) {
    if (e.city) counts.set(e.city, (counts.get(e.city) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([city]) => city)
}
