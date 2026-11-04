/**
 * Subset of the `Event` schema in docs/api/website.openapi.yaml, plus the
 * proposed list-card fields marked below (not yet returned by the backend).
 */
export interface PublicEvent {
  id: string
  title: string
  description?: string
  /** Unix timestamp. Seconds or milliseconds; see `toDate`. */
  startsAt?: number | string
  endsAt?: number | string
  timezone?: string
  currency?: string
  categoryId?: number
  attendanceType?: 'in_person' | 'virtual' | 'hybrid'
  heroImageUrl?: string
  accentColor?: string
  promoTagline?: string

  // Proposed additions to the public event list card.
  /** Lowest ticket price in minor units. 0 = free. Absent = unknown. */
  priceFromMinor?: number
  venueName?: string
  city?: string
  /** Tickets remaining across all types. Absent = plenty or unknown. */
  ticketsLeft?: number
  soldOut?: boolean
}

export interface EventCategory {
  id: number
  slug: string
  name: string
}
