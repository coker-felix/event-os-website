import type { CheckoutIssue } from './errors'
import type { Cart } from './types'
import type { PublicTicketType } from '#/features/tickets/types'

/** What changed between two versions of a cart, one plain line per ticket type. */
export function describeCartChange(
  before: Cart,
  after: Cart,
  names: Map<string, string>,
): Array<string> {
  const now = new Map(after.lines.map((l) => [l.ticketTypeId, l.qty] as const))
  const out: Array<string> = []
  for (const line of before.lines) {
    const name = names.get(line.ticketTypeId) ?? 'Ticket'
    const qty = now.get(line.ticketTypeId) ?? 0
    if (qty === 0) out.push(`${name} is no longer available`)
    else if (qty !== line.qty) out.push(`${name}: ${line.qty} → ${qty}`)
  }
  return out
}

export interface IssueNotice {
  message: string
  /** Pay button reads "Confirm to pay" until the buyer acknowledges. */
  needsConfirm: boolean
  refreshCart: boolean
  clearCart: boolean
  showQuestions: boolean
  contactLink: boolean
  retry: boolean
}

const NONE = {
  needsConfirm: false,
  refreshCart: false,
  clearCart: false,
  showQuestions: false,
  contactLink: false,
  retry: false,
}

/** How the page responds to each kind of checkout problem. */
export function issueNotice(issue: CheckoutIssue): IssueNotice {
  switch (issue.kind) {
    case 'requote':
      return {
        ...NONE,
        message:
          "The price changed. We've updated your order. Check the total, then confirm to pay.",
        needsConfirm: true,
        refreshCart: true,
      }
    case 'inventory':
      return {
        ...NONE,
        message: `${issue.message} We've updated your order.`,
        needsConfirm: true,
        refreshCart: true,
      }
    case 'questionnaire_stale':
      return {
        ...NONE,
        message: 'The event changed its questions. Check your answers below.',
        showQuestions: true,
      }
    case 'unsupported_location':
      return {
        ...NONE,
        message: "We can't sell tickets to this location yet.",
        contactLink: true,
      }
    case 'cart_missing':
      return {
        ...NONE,
        message: 'Your cart expired. Pick your tickets again.',
        clearCart: true,
      }
    case 'network':
      return {
        ...NONE,
        message: "We couldn't reach the server. Check your connection and try again.",
        retry: true,
      }
    case 'unknown':
      return {
        ...NONE,
        message:
          'Something went wrong with your order. Try again, or contact us if it keeps happening.',
        contactLink: true,
        retry: true,
      }
  }
}

/** Billing country is needed only when the cart holds a virtual ticket. */
export function needsBillingCountry(
  types: Array<PublicTicketType>,
  cart: Cart,
): boolean {
  const virtual = new Set(
    types.filter((t) => t.supplyKind === 'virtual').map((t) => t.id),
  )
  return cart.lines.some((l) => virtual.has(l.ticketTypeId))
}

/** Same cart state gives the same string, which gives the same idempotency key. */
export function checkoutFingerprint(parts: {
  cartId: string
  quoteRevision: string
  phone: string
  email: string
  delivery: string
  billingCountry: string
  answers: unknown
}): string {
  return JSON.stringify([
    parts.cartId,
    parts.quoteRevision,
    parts.phone,
    parts.email,
    parts.delivery,
    parts.billingCountry,
    parts.answers,
  ])
}
