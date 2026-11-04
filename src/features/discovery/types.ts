/** Proposed contracts: see section 11 of website-landing-api.md in the backend repo. */
export interface Organizer {
  id: string
  name: string
  city?: string
  bio?: string
  logoUrl?: string
  /** Events on sale now, for the trending card. */
  upcomingCount?: number
  /** Events hosted so far. */
  hostedCount?: number
}

export interface PastEvent {
  id: string
  title: string
  startsAt?: number | string
  timezone?: string
  city?: string
  organizerId?: string
  organizerName?: string
  accentColor?: string
  coverUrl?: string
  /** Up to 12 https photo URLs. */
  photos: Array<string>
  /** Total photos, when the list above is only a sample. */
  photoCount?: number
  /** An aftermovie or replay. Opened in a new tab, never embedded. */
  videoUrl?: string
  rating?: { average: number; count: number }
}

export interface Review {
  id: string
  /** Whole number, 1 to 5. */
  rating: number
  text: string
  createdAt?: number | string
}

export interface ReviewSummary {
  average: number
  count: number
  /** At most 3, newest first. */
  recent: Array<Review>
}

export type ReviewSubject = { kind: 'event' | 'organizer'; id: string }
