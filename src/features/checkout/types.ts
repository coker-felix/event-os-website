import type { QuestionAnswer } from './validation'

export type DeliveryChannel = '' | 'sms' | 'email'

export interface CartLine {
  ticketTypeId: string
  qty: number
}

export interface CartQuoteLine {
  ticketTypeId: string
  name: string
  qty: number
  baseUnitPriceMinor: number
  unitPriceMinor: number
  lineTotalMinor: number
  admissionsPerUnit?: number
}

/** `Cart` from docs/api/website.openapi.yaml, with int64 values as numbers. */
export interface Cart {
  id: string
  eventId: string
  status: 'active' | 'checked_out' | 'expired' | 'merged'
  revision: number
  lines: Array<CartLine>
  contactPhone?: string
  contactEmail?: string
  preferredDeliveryChannel?: DeliveryChannel
  quoteRevision?: string
  currency?: string
  quoteLines?: Array<CartQuoteLine>
  baseSubtotalMinor?: number
  volumeDiscountMinor?: number
  subtotalMinor?: number
  expiresAt?: number
  orderId?: string
  questionnaireVersionId?: string
}

export interface CartResponse {
  cart: Cart
  /** Set only when minted by this call. Store it: it is never shown again. */
  accessToken?: string
}

export interface CheckoutBody {
  contactPhone?: string
  contactEmail?: string
  expectedQuoteRevision?: string
  billingCountry?: string
  billingSubdivision?: string
  questionnaireVersionId?: string
  answers?: Array<QuestionAnswer>
  seriesUpdatesConsent?: boolean | null
  deliveryChannel?: DeliveryChannel | null
}

/** Frozen snake_case shape shared by every checkout path. */
export interface CheckoutResult {
  order_id: string
  total: number
  currency?: string
  status: 'paid' | 'pending'
  paystack_ref?: string
  authorization_url?: string
  deduplicated?: boolean
  couponCode?: string
  discountMinor?: number
}
