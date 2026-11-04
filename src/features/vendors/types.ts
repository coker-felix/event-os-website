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
