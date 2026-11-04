import { uuidFromSeed } from '#/lib/mocks'
import type { HeldBlock, VenueEntry, VenueProfile } from './types'

/**
 * Invented venues data for development only (see src/lib/mocks.ts). Reached
 * only through `await import('./mocks')` inside `if (MOCKS_ENABLED)`, so a
 * production build never loads it.
 */

const DAY = 86_400

const ROWS: Array<Omit<VenueEntry, 'id'>> = [
  { name: 'Beach View Hall', city: 'Accra', country: 'GH', capacity: 500, claimed: true },
  { name: 'The Atrium', city: 'Lagos', country: 'NG', capacity: 120, claimed: false },
  { name: 'Cedar Room', city: 'Kumasi', country: 'GH', capacity: 60, claimed: true },
  { name: 'Dome Arena', city: 'Lagos', country: 'NG', capacity: 1500, claimed: true },
  { name: 'Garden Pavilion', city: 'Accra', country: 'GH', capacity: 250, claimed: false },
  { name: 'Skyline Terrace', city: 'Lagos', country: 'NG', capacity: 300, claimed: true },
]

const AMENITIES = ['Parking', 'Stage', 'Air conditioning', 'Catering kitchen', 'Sound system', 'Wheelchair access']

export function mockVenues(): Array<VenueEntry> {
  return ROWS.map((row, i) => ({ id: uuidFromSeed(`venue-${i}`), ...row }))
}

export function mockVenueProfile(id: string): VenueProfile | null {
  const index = mockVenues().findIndex((v) => v.id === id)
  if (index < 0) return null
  const v = mockVenues()[index]
  return {
    id,
    name: v.name,
    address: `${index + 10} Sample Road`,
    city: v.city,
    country: v.country,
    capacity: v.capacity,
    category: 'event-space',
    description: `${v.name} is an invented venue, shown in development only. It holds up to ${v.capacity} guests.`,
    amenities: AMENITIES.slice(0, 3 + (index % 3)),
    rating: v.claimed && index % 2 === 0 ? 4.6 : undefined,
    ratingCount: v.claimed && index % 2 === 0 ? 9 : undefined,
    claimed: v.claimed,
    websiteUrl: 'https://example.com/venue',
    socialLinks: { instagram: 'https://instagram.com/example' },
  }
}

/** Invented held dates: a claimed venue gets three upcoming blocks, an unclaimed one none. */
export function mockHeldBlocks(
  id: string,
  nowSec = Math.floor(Date.now() / 1000),
): Array<HeldBlock> {
  const venue = mockVenues().find((v) => v.id === id)
  if (!venue?.claimed) return []
  const today = Math.floor(nowSec / DAY) * DAY
  return [
    { id: `${id}-1`, fromAt: today + 10 * DAY, toAt: today + 12 * DAY },
    { id: `${id}-2`, fromAt: today + 25 * DAY, toAt: today + 26 * DAY },
    { id: `${id}-3`, fromAt: today + 60 * DAY, toAt: today + 63 * DAY },
  ]
}
