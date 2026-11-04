/** Subset of the `Event` schema in docs/api/website.openapi.yaml. */
export interface PublicEvent {
  id: string
  title: string
  description?: string
  /** Unix timestamp. Seconds or milliseconds; see `toDate`. */
  startsAt?: number | string
  endsAt?: number | string
  timezone?: string
  categoryId?: number
  attendanceType?: 'in_person' | 'virtual' | 'hybrid'
  heroImageUrl?: string
  accentColor?: string
  promoTagline?: string
}

export interface EventCategory {
  id: number
  slug: string
  name: string
}
