import type {
  Cart,
  CartLine,
  CartQuoteLine,
  CheckoutResult,
  DeliveryChannel,
} from './types'

type Raw = Record<string, unknown>

function num(v: unknown): number | undefined {
  if (v === undefined || v === null || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v !== '' ? v : undefined
}

function rows(v: unknown): Array<Raw> {
  return Array.isArray(v) ? (v as Array<Raw>) : []
}

/** Turn an API cart (int64 values as strings) into a `Cart` with numbers. */
export function normaliseCart(raw: Raw): Cart {
  const lines: Array<CartLine> = rows(raw.lines).map((l) => ({
    ticketTypeId: String(l.ticketTypeId),
    qty: num(l.qty) ?? 0,
  }))
  const quote = rows(raw.quoteLines)
  const quoteLines: Array<CartQuoteLine> | undefined = quote.length
    ? quote.map((q) => ({
        ticketTypeId: String(q.ticketTypeId),
        name: String(q.name ?? ''),
        qty: num(q.qty) ?? 0,
        baseUnitPriceMinor: num(q.baseUnitPriceMinor) ?? 0,
        unitPriceMinor: num(q.unitPriceMinor) ?? 0,
        lineTotalMinor: num(q.lineTotalMinor) ?? 0,
        admissionsPerUnit: num(q.admissionsPerUnit),
      }))
    : undefined
  return {
    id: String(raw.id),
    eventId: String(raw.eventId),
    status: (raw.status as Cart['status'] | undefined) ?? 'active',
    revision: num(raw.revision) ?? 0,
    lines,
    contactPhone: str(raw.contactPhone),
    contactEmail: str(raw.contactEmail),
    preferredDeliveryChannel: raw.preferredDeliveryChannel as
      | DeliveryChannel
      | undefined,
    quoteRevision: str(raw.quoteRevision),
    currency: str(raw.currency),
    quoteLines,
    baseSubtotalMinor: num(raw.baseSubtotalMinor),
    volumeDiscountMinor: num(raw.volumeDiscountMinor),
    subtotalMinor: num(raw.subtotalMinor),
    expiresAt: num(raw.expiresAt),
    orderId: str(raw.orderId),
    questionnaireVersionId: str(raw.questionnaireVersionId),
  }
}

export function normaliseCheckoutResult(raw: Raw): CheckoutResult {
  return {
    order_id: String(raw.order_id),
    total: num(raw.total) ?? 0,
    currency: str(raw.currency),
    status: raw.status === 'paid' ? 'paid' : 'pending',
    paystack_ref: str(raw.paystack_ref),
    authorization_url: str(raw.authorization_url),
    deduplicated: raw.deduplicated === true ? true : undefined,
    couponCode: str(raw.couponCode),
    discountMinor: num(raw.discountMinor),
  }
}
