import type { PublicEvent } from '#/features/events/types'

/** A bulk price: from `minQty` tickets on, each costs `unitPriceMinor`. */
export interface VolumeTier {
  minQty: number
  unitPriceMinor: number
}

/**
 * `PublicTicketType` from docs/api/website.openapi.yaml with int64 values
 * already turned into numbers (protojson sends them as strings), plus the
 * proposed `description` and `includes` (not yet returned by the backend).
 */
export interface PublicTicketType {
  id: string
  name: string
  priceMinor: number
  /** Tickets left. Absent = not reported. */
  available?: number
  saleStartAt?: number
  saleEndAt?: number
  minPerOrder?: number
  maxPerOrder?: number
  maxPerBuyer?: number
  volumeTiers?: Array<VolumeTier>
  supplyKind?: 'physical' | 'virtual'
  /** 1 = single admission, more = a fixed-size bundle. */
  admissionsPerUnit?: number
  description?: string
  includes?: Array<string>
}

export interface EventSponsor {
  id: string
  sponsorId?: string
  name: string
  logoUrl?: string
  websiteUrl?: string
  tier?: '' | 'media' | 'presenting' | 'platinum' | 'gold' | 'silver' | 'bronze'
  sortOrder?: number
}

export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'single_select'
  | 'multi_select'
  | 'boolean'
  | 'date'
  | 'waiver'

export interface Question {
  id: string
  position?: number
  type: QuestionType
  label: string
  required?: boolean
  options?: Array<string>
  waiverText?: string
}

export interface PublicQuestionnaire {
  versionId: string
  version?: number
  questions: Array<Question>
}

export interface PublicEventPage {
  event: PublicEvent
  ticketTypes: Array<PublicTicketType>
  sponsors: Array<EventSponsor>
  questionnaire?: PublicQuestionnaire
}
