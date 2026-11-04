/**
 * Coarse availability of an event, decided by the backend. The public API
 * never exposes raw stock, so the website only ever shows a level.
 */
export type Availability = 'available' | 'low' | 'sold_out'

export function availabilityBadge(
  a: Availability | undefined,
): 'Sold out' | 'Selling fast' | null {
  if (a === 'sold_out') return 'Sold out'
  if (a === 'low') return 'Selling fast'
  return null
}
