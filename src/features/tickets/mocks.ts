import { MOCKS_ENABLED, hash } from '#/lib/mocks'
import type { PublicTicketType } from './types'

const DESCRIPTIONS = [
  'Entry + 1 drink · Standing',
  'Entry · Open seating',
  'Entry + welcome snack · Standing',
]

const INCLUDES = [
  ['Entry for one person', 'One welcome drink', 'Access to the main floor'],
  ['Entry for one person', 'Open seating', 'Free water refills'],
  ['Entry for one person', 'Welcome snack', 'Cloakroom'],
]

/**
 * Fill ticket `description` and `includes`, which the backend does not
 * return yet, with stable invented text. Only missing fields are filled.
 */
export function withTicketExtras(
  t: PublicTicketType,
  enabled: boolean = MOCKS_ENABLED,
): PublicTicketType {
  if (!enabled) return t
  const h = hash(t.id + t.name)
  return {
    ...t,
    description: t.description ?? DESCRIPTIONS[h % DESCRIPTIONS.length],
    includes: t.includes ?? INCLUDES[h % INCLUDES.length],
  }
}

/** Used in dev when a published event has no ticket types at all. */
export function mockTicketTypes(
  eventId: string,
  nowSec = Math.floor(Date.now() / 1000),
): Array<PublicTicketType> {
  const base = (id: string, rest: Omit<PublicTicketType, 'id'>) =>
    withTicketExtras({ id: `${eventId}-${id}`, ...rest }, true)
  return [
    base('general', {
      name: 'General',
      priceMinor: 800_000,
      available: 60,
      maxPerOrder: 6,
      volumeTiers: [{ minQty: 4, unitPriceMinor: 720_000 }],
    }),
    base('couple', {
      name: 'Couple pass',
      priceMinor: 1_400_000,
      available: 30,
      admissionsPerUnit: 2,
      description: 'Entry for two + 2 drinks',
    }),
    base('vip', { name: 'VIP', priceMinor: 2_500_000, available: 0 }),
    base('early', {
      name: 'Early bird',
      priceMinor: 500_000,
      available: 100,
      saleStartAt: nowSec + 3 * 86_400,
    }),
  ]
}
