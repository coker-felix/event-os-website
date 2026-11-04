/**
 * Proposed contract for `GET /api/v1/banners` (not yet implemented in the
 * backend). The server decides order, including featured events first, and
 * only returns banners that are currently active.
 */
export type BannerType = 'event' | 'editorial' | 'platform'

export interface Banner {
  id: string
  type: BannerType
  title: string
  subtitle?: string
  imageUrl?: string
  /** "#RRGGBB". Tints the banner when there is no image. */
  accentColor?: string
  ctaLabel: string
  /** Internal path ("/events/abc") or absolute URL. */
  href: string
  /** Unix seconds. Banner is hidden outside [startsAt, endsAt]. */
  startsAt?: number
  endsAt?: number
  /** Unix seconds. Only for `type: "event"`: when the event starts. */
  eventStartsAt?: number
  eventTimezone?: string
}

export interface BannersResponse {
  banners: Array<Banner>
}
