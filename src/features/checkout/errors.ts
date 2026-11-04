import { ApiError } from '#/lib/api'

/** What went wrong at checkout, in terms the page can show. */
export type CheckoutIssue =
  | { kind: 'requote' }
  | { kind: 'inventory'; message: string }
  | { kind: 'questionnaire_stale'; questionnaire: unknown }
  | { kind: 'unsupported_location'; reason: string }
  | { kind: 'cart_missing' }
  | { kind: 'network' }
  | { kind: 'unknown' }

const INVENTORY_FALLBACK = 'Some tickets are no longer available.'

/** What to tell a buyer when starting an order fails (before checkout). */
export function buyErrorMessage(err: unknown): string {
  const issue = classifyCheckoutError(err)
  switch (issue.kind) {
    case 'cart_missing':
      // Carts answer 404 when the event's organizer has them turned off.
      return "Online checkout isn't available for this event yet. Contact us if you need help."
    case 'network':
      return "We couldn't reach the server. Check your connection and try again."
    case 'inventory':
      return issue.message
    default:
      return "We couldn't start your order. Try again, or contact us if it keeps happening."
  }
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' ? (v as Record<string, unknown>) : {}
}

export function classifyCheckoutError(err: unknown): CheckoutIssue {
  if (err instanceof ApiError) {
    const body = asRecord(err.body)
    if (err.status === 404) return { kind: 'cart_missing' }
    if (err.status === 409) {
      if (body.requoteRequired === true) return { kind: 'requote' }
      if (body.questionnaireStale === true) {
        return { kind: 'questionnaire_stale', questionnaire: body.questionnaire }
      }
      const message =
        typeof body.error === 'string' && body.error ? body.error : INVENTORY_FALLBACK
      return { kind: 'inventory', message }
    }
    if (err.status === 422 && body.error === 'unsupported_jurisdiction') {
      return {
        kind: 'unsupported_location',
        reason: typeof body.reason === 'string' ? body.reason : '',
      }
    }
    return { kind: 'unknown' }
  }
  if (
    err instanceof TypeError ||
    (err instanceof DOMException &&
      (err.name === 'TimeoutError' || err.name === 'AbortError'))
  ) {
    return { kind: 'network' }
  }
  return { kind: 'unknown' }
}
