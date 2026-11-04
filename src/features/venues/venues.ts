import { safeHttpUrl } from '#/lib/url'
import type { HeldBlock, VenueEntry } from './types'

const DAY = 86_400
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const CAPACITY_STEPS: Array<{ min: 100 | 300 | 1000; label: string }> = [
  { min: 100, label: '100+' },
  { min: 300, label: '300+' },
  { min: 1000, label: '1000+' },
]

export function filterVenues(
  venues: Array<VenueEntry>,
  f: { city?: string; country?: string; minCapacity?: number; bookableOnly?: boolean },
): Array<VenueEntry> {
  return venues.filter((v) => {
    if (f.city && v.city !== f.city) return false
    if (f.country && v.country !== f.country) return false
    if (f.minCapacity !== undefined && (v.capacity === undefined || v.capacity < f.minCapacity))
      return false
    if (f.bookableOnly && !v.claimed) return false
    return true
  })
}

/** Bookable (claimed) venues first, then by name ignoring case. Does not change the input. */
export function sortVenues(venues: Array<VenueEntry>): Array<VenueEntry> {
  return [...venues].sort((a, b) => {
    if (a.claimed !== b.claimed) return a.claimed ? -1 : 1
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  })
}

function distinct(values: Array<string | undefined>): Array<string> {
  return [...new Set(values.filter((v): v is string => !!v))].sort((a, b) => a.localeCompare(b))
}

export function venueCities(venues: Array<VenueEntry>): Array<string> {
  return distinct(venues.map((v) => v.city))
}

export function venueCountries(venues: Array<VenueEntry>): Array<string> {
  return distinct(venues.map((v) => v.country))
}

/** Held blocks that overlap the next `days` days, soonest first. Bad and past blocks are dropped. */
export function upcomingBlocks(
  blocks: Array<HeldBlock>,
  nowSec: number,
  days = 90,
): Array<HeldBlock> {
  const windowEnd = nowSec + days * DAY
  return blocks
    .filter((b) => b.toAt > b.fromAt && b.toAt > nowSec && b.fromAt < windowEnd)
    .sort((a, b) => a.fromAt - b.fromAt)
}

/**
 * "12 to 14 Dec 2026". Read in UTC, and a range is taken to end the second
 * before `toAt`, so a block ending at midnight does not claim the next day.
 */
export function formatHeldRange(fromAt: number, toAt: number): string {
  const start = new Date(fromAt * 1000)
  const end = new Date(Math.max(fromAt, toAt - 1) * 1000)
  const [sd, sm, sy] = [start.getUTCDate(), start.getUTCMonth(), start.getUTCFullYear()]
  const [ed, em, ey] = [end.getUTCDate(), end.getUTCMonth(), end.getUTCFullYear()]
  if (sy === ey && sm === em && sd === ed) return `${sd} ${MONTHS[sm]} ${sy}`
  if (sy === ey && sm === em) return `${sd} to ${ed} ${MONTHS[em]} ${ey}`
  if (sy === ey) return `${sd} ${MONTHS[sm]} to ${ed} ${MONTHS[em]} ${ey}`
  return `${sd} ${MONTHS[sm]} ${sy} to ${ed} ${MONTHS[em]} ${ey}`
}

/** Only http(s) links, sorted by platform. Anything else could run script on click. */
export function safeSocialLinks(
  links: Record<string, string>,
): Array<{ platform: string; url: string }> {
  return Object.entries(links)
    .flatMap(([platform, url]) => {
      const safe = safeHttpUrl(url)
      return safe ? [{ platform, url: safe }] : []
    })
    .sort((a, b) => a.platform.localeCompare(b.platform))
}
