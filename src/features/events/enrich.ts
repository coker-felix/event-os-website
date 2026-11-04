import { MOCKS_ENABLED, hash } from '#/lib/mocks'
import type { Availability } from './availability'
import type { PublicEvent } from './types'

const PLACES: Array<{ city: string; venues: Array<string> }> = [
  {
    city: 'Lagos',
    venues: ['Eko Convention Centre', 'The Terrace Rooftop', 'Landmark Beach'],
  },
  { city: 'Abuja', venues: ['Transcorp Hall', 'Jabi Lake Park'] },
  { city: 'Port Harcourt', venues: ['Pleasure Park'] },
  { city: 'Ibadan', venues: ['Cocoa House Gardens'] },
]

// Minor units (kobo): free, then 5k, 8k, 10k, 15k, 25k.
const PRICES = [0, 500_000, 800_000, 1_000_000, 1_500_000, 2_500_000]

/**
 * Fill list-card fields the backend does not return yet with stable,
 * invented values. Only fields that are missing are filled.
 */
export function withEventExtras(
  e: PublicEvent,
  enabled: boolean = MOCKS_ENABLED,
): PublicEvent {
  if (!enabled) return e
  const h = hash(e.id)
  const place = PLACES[h % PLACES.length]
  const isOnline = e.attendanceType === 'virtual'
  const availability: Availability =
    h % 7 === 0 ? 'sold_out' : h % 5 === 0 ? 'low' : 'available'
  return {
    ...e,
    priceFromMinor: e.priceFromMinor ?? PRICES[h % PRICES.length],
    city: e.city ?? (isOnline ? undefined : place.city),
    venueName:
      e.venueName ??
      (isOnline
        ? 'Online'
        : place.venues[(h >>> 3) % place.venues.length]),
    availability: e.availability ?? availability,
  }
}
