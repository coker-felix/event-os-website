import type { PublicEvent } from '#/features/events/types'

/** Set by an admin. Only `verified` and `partnered` get a badge. */
export type VendorTier = 'normal' | 'verified' | 'partnered'

/**
 * An open call for vendors, from `GET /api/v1/vendor-callouts`. It carries no
 * title, date or place of its own: those come from the event it belongs to.
 */
export interface Callout {
  id: string
  eventId: string
  category: string
  serviceKinds: Array<string>
  /** Unix seconds. Absent when the API sends zero (protojson omits zero). */
  opensAt?: number
  closesAt?: number
}

/** A callout with its event attached, when the event is known. */
export interface CalloutCard {
  callout: Callout
  event?: PublicEvent
}

export interface CalloutList {
  callouts: Array<Callout>
  hasMore: boolean
}

/**
 * A row of the public vendor directory. The API returns only `id`,
 * `businessName` and `tier` today; the last four are proposed additions
 * (backend request) and are shown only when present.
 */
export interface VendorEntry {
  id: string
  businessName: string
  tier: VendorTier
  category?: string
  city?: string
  summary?: string
  imageUrl?: string
}

export interface VendorList {
  vendors: Array<VendorEntry>
  hasMore: boolean
}

export interface VendorService {
  kind?: string
  name: string
  /** Minor units of `currency`. */
  priceMinor?: number
  currency?: string
}

/** The public store page from `GET /api/v1/vendors/{id}`. */
export interface VendorProfile {
  id: string
  businessName: string
  description?: string
  category?: string
  city?: string
  country?: string
  tier: VendorTier
  services: Array<VendorService>
  /** Aggregate score; only set when there is at least one rating. */
  rating?: number
  ratingCount?: number
}
