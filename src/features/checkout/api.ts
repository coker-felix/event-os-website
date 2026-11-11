import { apiRequest } from '#/lib/api'
import { normaliseCart, normaliseCheckoutResult } from './normalise'
import type {
  CartLine,
  CartResponse,
  CheckoutBody,
  CheckoutResult,
  DeliveryChannel,
  Cart,
} from './types'

type Raw = Record<string, unknown>
interface RawCartResponse {
  cart: Raw
  accessToken?: string
}

const tokenHeader = (token: string) => ({ 'X-Cart-Token': token })

function toCartResponse(raw: RawCartResponse): CartResponse {
  return { cart: normaliseCart(raw.cart), accessToken: raw.accessToken }
}

export async function createCart(
  eventId: string,
  lines: Array<CartLine>,
  contact: {
    contactPhone?: string
    contactEmail?: string
    preferredDeliveryChannel?: DeliveryChannel
  } = {},
): Promise<CartResponse> {
  const raw = await apiRequest<RawCartResponse>('POST', '/api/v1/carts', {
    body: { eventId, lines, ...contact },
    timeoutMs: 60_000,
  })
  return toCartResponse(raw)
}

export async function getCart(cartId: string, token: string): Promise<Cart> {
  const raw = await apiRequest<RawCartResponse>(
    'GET',
    `/api/v1/carts/${encodeURIComponent(cartId)}`,
    { headers: tokenHeader(token) },
  )
  return toCartResponse(raw).cart
}

export async function setCartLine(
  cartId: string,
  token: string,
  ticketTypeId: string,
  qty: number,
  expectedRevision = 0,
): Promise<Cart> {
  const raw = await apiRequest<RawCartResponse>(
    'PUT',
    `/api/v1/carts/${encodeURIComponent(cartId)}/lines/${encodeURIComponent(ticketTypeId)}`,
    { body: { qty, expectedRevision }, headers: tokenHeader(token) },
  )
  return toCartResponse(raw).cart
}

export async function updateContact(
  cartId: string,
  token: string,
  contact: {
    contactPhone?: string
    contactEmail?: string
    preferredDeliveryChannel?: DeliveryChannel
    expectedRevision?: number
  },
): Promise<Cart> {
  const raw = await apiRequest<RawCartResponse>(
    'PATCH',
    `/api/v1/carts/${encodeURIComponent(cartId)}/contact`,
    { body: contact, headers: tokenHeader(token) },
  )
  return toCartResponse(raw).cart
}

/** Pay for a cart. The same `idempotencyKey` is safe to retry. */
export async function checkoutCart(
  cartId: string,
  token: string,
  body: CheckoutBody,
  idempotencyKey: string,
): Promise<CheckoutResult> {
  const raw = await apiRequest<Raw>(
    'POST',
    `/api/v1/carts/${encodeURIComponent(cartId)}/checkout`,
    {
      body,
      headers: { ...tokenHeader(token), 'Idempotency-Key': idempotencyKey },
      timeoutMs: 60_000,
    },
  )
  return normaliseCheckoutResult(raw)
}
