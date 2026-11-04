/**
 * A row of the public venue directory (`GET /api/v1/venues`). The API returns
 * `id`, `name`, `city`, `country`, `capacity` and `claimed`; `category` and
 * `imageUrl` are proposed additions (backend request) and shown only when present.
 */
export interface VenueEntry {
  id: string
  name: string
  city?: string
  country?: string
  /** Guests the venue holds. Absent when not listed (the API sends zero for none). */
  capacity?: number
  /** Claimed venues are managed by their owner and can be booked. Unclaimed ones are listing only. */
  claimed: boolean
  category?: string
  imageUrl?: string
}

export interface VenueList {
  venues: Array<VenueEntry>
  hasMore: boolean
}

/** The public venue page from `GET /api/v1/venues/{id}`. */
export interface VenueProfile {
  id: string
  name: string
  address?: string
  city?: string
  country?: string
  capacity?: number
  category?: string
  description?: string
  amenities: Array<string>
  /** Aggregate score; only set when there is at least one rating. */
  rating?: number
  ratingCount?: number
  claimed: boolean
  websiteUrl?: string
  /** Platform name to profile URL. Only http(s) links are ever rendered. */
  socialLinks: Record<string, string>
}

/** A date range the venue already holds. Unix seconds; no personal details. */
export interface HeldBlock {
  id: string
  fromAt: number
  toAt: number
}

/**
 * What the availability call told us. `open` is false for an unclaimed or
 * inactive venue (the API answers 409): nothing is bookable, and that is not
 * an error.
 */
export interface VenueAvailability {
  open: boolean
  blocks: Array<HeldBlock>
}
