import { queryOptions } from '@tanstack/react-query'
import { ApiError, apiGet } from '#/lib/api'
import { MOCKS_ENABLED } from '#/lib/mocks'

export type Outcome = 'paid' | 'pending' | 'failed'

export interface ReturnParams {
  /** Paystack reference, appended to the callback URL as `?reference=`. */
  reference?: string
  /** Our order id, used when a free order skips Paystack. */
  order?: string
  /** Dev only: force an outcome while the status endpoint does not exist. */
  outcome?: Outcome
}

export interface OrderStatus {
  status: Outcome
  orderId: string
  total: number
  currency?: string
  /** Where the tickets were sent, for example "+234 80… by SMS". */
  deliveredTo?: string
  /** Lets the page offer "Try again" and "Add to calendar". */
  eventId?: string
}

function text(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}

/** Read the return URL's query. Junk and blanks are dropped. */
export function parseReturnParams(
  search: Record<string, unknown>,
  mocksEnabled: boolean = MOCKS_ENABLED,
): ReturnParams {
  const out: ReturnParams = {}
  const reference = text(search.reference)
  if (reference) out.reference = reference
  const order = text(search.order)
  if (order) out.order = order
  if (
    mocksEnabled &&
    (search.outcome === 'paid' ||
      search.outcome === 'pending' ||
      search.outcome === 'failed')
  ) {
    out.outcome = search.outcome
  }
  return out
}

const FIRST_DELAYS = [2000, 3000, 5000]
const LATER_DELAY = 10_000
const MAX_WAIT_MS = 3 * 60 * 1000

/**
 * Wait after check number `attempt` (0 is the first) before checking again:
 * 2s, 3s, 5s, then every 10s. `null` once the total wait would pass 3 minutes.
 */
export function nextPollDelay(attempt: number): number | null {
  let elapsed = 0
  for (let i = 0; i <= attempt; i++) {
    elapsed += i < FIRST_DELAYS.length ? FIRST_DELAYS[i] : LATER_DELAY
    if (elapsed > MAX_WAIT_MS) return null
  }
  return attempt < FIRST_DELAYS.length ? FIRST_DELAYS[attempt] : LATER_DELAY
}

/** Invented status for dev, used while the status endpoint does not exist. */
export function mockOrderStatus(ref: ReturnParams): OrderStatus {
  return {
    status: ref.outcome ?? 'pending',
    orderId: ref.order ?? ref.reference ?? 'unknown',
    total: 1_600_000,
    currency: 'NGN',
    deliveredTo: '+234 80… by SMS',
  }
}

/**
 * Proposed `GET /api/v1/orders/status?reference=` (or `?order=`): the
 * payment outcome for the return page. In dev, when the endpoint is
 * missing, the status comes from `?outcome=` instead.
 */
export const orderStatusQuery = (ref: ReturnParams) =>
  queryOptions({
    queryKey: ['order-status', ref.reference ?? ref.order ?? '', ref.outcome ?? ''],
    queryFn: async (): Promise<OrderStatus> => {
      const qs = new URLSearchParams(
        ref.reference ? { reference: ref.reference } : { order: ref.order ?? '' },
      )
      try {
        const raw = await apiGet<Record<string, unknown>>(
          `/api/v1/orders/status?${qs.toString()}`,
        )
        return {
          status: raw.status === 'paid' ? 'paid' : raw.status === 'failed' ? 'failed' : 'pending',
          orderId: String(raw.orderId ?? ref.order ?? ref.reference ?? ''),
          total: Number(raw.total) || 0,
          currency: text(raw.currency),
          deliveredTo: text(raw.deliveredTo),
          eventId: text(raw.eventId),
        }
      } catch (err) {
        const missing = err instanceof ApiError && err.status === 404
        if (MOCKS_ENABLED && (missing || !(err instanceof ApiError))) {
          return mockOrderStatus(ref)
        }
        throw err
      }
    },
    retry: false,
  })
