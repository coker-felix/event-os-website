import { describe, expect, it } from 'vitest'
import {
  checkoutFingerprint,
  describeCartChange,
  issueNotice,
  needsBillingCountry,
} from './changes'
import type { Cart } from './types'
import type { PublicTicketType } from '#/features/tickets/types'

const cart = (lines: Array<[string, number]>, extra: Partial<Cart> = {}): Cart => ({
  id: 'c1',
  eventId: 'e1',
  status: 'active',
  revision: 1,
  lines: lines.map(([ticketTypeId, qty]) => ({ ticketTypeId, qty })),
  ...extra,
})
const names = new Map([
  ['t1', 'General'],
  ['t2', 'VIP'],
])

describe('describeCartChange', () => {
  it('says when a quantity was reduced', () => {
    expect(describeCartChange(cart([['t1', 2]]), cart([['t1', 1]]), names)).toEqual([
      'General: 2 → 1',
    ])
  })

  it('says when a ticket type was removed', () => {
    expect(
      describeCartChange(cart([['t1', 2], ['t2', 1]]), cart([['t1', 2]]), names),
    ).toEqual(['VIP is no longer available'])
  })

  it('reports nothing when the lines are the same', () => {
    expect(describeCartChange(cart([['t1', 2]]), cart([['t1', 2]]), names)).toEqual([])
  })

  it('falls back to a generic name for an unknown ticket type', () => {
    expect(describeCartChange(cart([['zz', 3]]), cart([['zz', 1]]), names)).toEqual([
      'Ticket: 3 → 1',
    ])
  })
})

describe('issueNotice', () => {
  it('requote refreshes the cart and asks for confirmation', () => {
    expect(issueNotice({ kind: 'requote' })).toMatchObject({
      refreshCart: true,
      needsConfirm: true,
      clearCart: false,
    })
  })

  it('inventory keeps the API message and asks for confirmation', () => {
    const n = issueNotice({ kind: 'inventory', message: 'Only 1 left' })
    expect(n.message).toContain('Only 1 left')
    expect(n).toMatchObject({ refreshCart: true, needsConfirm: true })
  })

  it('a stale questionnaire shows the new questions', () => {
    expect(
      issueNotice({ kind: 'questionnaire_stale', questionnaire: {} }),
    ).toMatchObject({ showQuestions: true, needsConfirm: false })
  })

  it('an unsupported location offers the contact page, with no retry', () => {
    expect(
      issueNotice({ kind: 'unsupported_location', reason: '' }),
    ).toMatchObject({ contactLink: true, retry: false })
  })

  it('a missing cart clears the stored cart', () => {
    expect(issueNotice({ kind: 'cart_missing' })).toMatchObject({ clearCart: true })
  })

  it('a network problem can be retried and does not touch the cart', () => {
    expect(issueNotice({ kind: 'network' })).toMatchObject({
      retry: true,
      clearCart: false,
      refreshCart: false,
    })
  })

  it('unknown failures say what to do', () => {
    const n = issueNotice({ kind: 'unknown' })
    expect(n.message.length).toBeGreaterThan(10)
    expect(n.contactLink).toBe(true)
  })
})

describe('needsBillingCountry', () => {
  const t = (id: string, supplyKind?: 'physical' | 'virtual'): PublicTicketType => ({
    id,
    name: id,
    priceMinor: 1,
    supplyKind,
  })

  it('is true only when a line in the cart is a virtual ticket', () => {
    const types = [t('t1', 'physical'), t('t2', 'virtual')]
    expect(needsBillingCountry(types, cart([['t2', 1]]))).toBe(true)
    expect(needsBillingCountry(types, cart([['t1', 1]]))).toBe(false)
    expect(needsBillingCountry(types, cart([]))).toBe(false)
  })
})

describe('checkoutFingerprint', () => {
  const base = {
    cartId: 'c1',
    quoteRevision: 'q1',
    phone: '+2348012345678',
    email: '',
    delivery: 'sms',
    billingCountry: '',
    answers: { a: { text: 'x' } },
  }
  it('is the same for the same inputs', () => {
    expect(checkoutFingerprint(base)).toBe(checkoutFingerprint({ ...base }))
  })
  it('changes when the quote, contact or answers change', () => {
    const f = checkoutFingerprint(base)
    expect(checkoutFingerprint({ ...base, quoteRevision: 'q2' })).not.toBe(f)
    expect(checkoutFingerprint({ ...base, phone: '+2348000000000' })).not.toBe(f)
    expect(checkoutFingerprint({ ...base, answers: { a: { text: 'y' } } })).not.toBe(f)
  })
})
