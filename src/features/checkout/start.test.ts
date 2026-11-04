import { describe, expect, it } from 'vitest'
import { normaliseCart, normaliseCheckoutResult } from './normalise'
import { startCheckout } from './start'
import type { CartResponse } from './types'

describe('normaliseCart', () => {
  it('turns protojson int64 strings into numbers', () => {
    const cart = normaliseCart({
      id: 'c1',
      eventId: 'e1',
      status: 'active',
      revision: '3',
      lines: [{ ticketTypeId: 't1', qty: '2' }],
      subtotalMinor: '1600000',
      expiresAt: '1800000000',
      quoteRevision: 'q9',
      currency: 'NGN',
      quoteLines: [
        {
          ticketTypeId: 't1',
          name: 'General',
          qty: '2',
          baseUnitPriceMinor: '800000',
          unitPriceMinor: '800000',
          lineTotalMinor: '1600000',
        },
      ],
    })
    expect(cart.revision).toBe(3)
    expect(cart.lines).toEqual([{ ticketTypeId: 't1', qty: 2 }])
    expect(cart.subtotalMinor).toBe(1_600_000)
    expect(cart.quoteLines?.[0].lineTotalMinor).toBe(1_600_000)
    expect(cart.quoteRevision).toBe('q9')
  })

  it('tolerates a cart with no lines or quote', () => {
    const cart = normaliseCart({ id: 'c2', eventId: 'e1', status: 'active' })
    expect(cart.lines).toEqual([])
    expect(cart.quoteLines).toBeUndefined()
    expect(cart.revision).toBe(0)
  })
})

describe('normaliseCheckoutResult', () => {
  it('reads the frozen snake_case shape and turns the total into a number', () => {
    expect(
      normaliseCheckoutResult({
        order_id: 'o1',
        total: '1664000',
        status: 'pending',
        authorization_url: 'https://paystack.test/x',
      }),
    ).toMatchObject({
      order_id: 'o1',
      total: 1_664_000,
      status: 'pending',
      authorization_url: 'https://paystack.test/x',
    })
  })
})

describe('startCheckout', () => {
  const cartRes = (token?: string): CartResponse => ({
    cart: { id: 'c1', eventId: 'e1', status: 'active', revision: 1, lines: [] },
    accessToken: token,
  })
  const lines = [{ ticketTypeId: 't1', qty: 2 }]

  it('creates a cart, stores its token and returns the cart id', async () => {
    const stored: Array<[string, { cartId: string; token: string }]> = []
    const out = await startCheckout('e1', lines, {
      createCart: async () => cartRes('tok'),
      stored: () => undefined,
      save: (eventId, cart) => stored.push([eventId, cart]),
    })
    expect(out).toEqual({ cartId: 'c1' })
    expect(stored).toEqual([['e1', { cartId: 'c1', token: 'tok' }]])
  })

  it('keeps the stored token when the API returns the same cart without one', async () => {
    const stored: Array<[string, { cartId: string; token: string }]> = []
    await startCheckout('e1', lines, {
      createCart: async () => cartRes(undefined),
      stored: () => ({ cartId: 'c1', token: 'old' }),
      save: (eventId, cart) => stored.push([eventId, cart]),
    })
    expect(stored).toEqual([['e1', { cartId: 'c1', token: 'old' }]])
  })

  it('refuses to continue when there is no token to use', async () => {
    await expect(
      startCheckout('e1', lines, {
        createCart: async () => cartRes(undefined),
        stored: () => undefined,
        save: () => undefined,
      }),
    ).rejects.toThrow('cart access token')
  })
})
