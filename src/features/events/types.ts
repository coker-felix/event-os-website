import type { Availability } from './availability'

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
  /** Coarse level decided by the backend. Absent = unknown. */
  availability?: Availability
  /** Unix timestamp. Used to sort by newest. */
  createdAt?: number | string
}

export interface EventCategory {
  id: number
  slug: string
  name: string
}
