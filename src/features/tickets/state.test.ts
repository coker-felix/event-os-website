import { describe, expect, it } from 'vitest'
import { mockTicketTypes, withTicketExtras } from './mocks'
import {
  clampQty,
  eventSaleState,
  isLow,
  normaliseTicketType,
  qtyBounds,
  selectedLines,
  subtotalMinor,
  ticketStatus,
  volumeHint,
} from './state'
import type { PublicEventPage, PublicTicketType } from './types'

const NOW = 1_800_000_000
const tt = (p: Partial<PublicTicketType> = {}): PublicTicketType => ({
  id: 't1',
  name: 'General',
  priceMinor: 800_000,
  ...p,
})
const page = (
  types: Array<PublicTicketType>,
  status = 'published',
): PublicEventPage => ({
  event: { id: 'e1', title: 'E', status } as PublicEventPage['event'],
  ticketTypes: types,
  sponsors: [],
})

describe('ticketStatus', () => {
  it('is buyable inside the sale window with stock', () => {
    expect(ticketStatus(tt({ available: 5 }), NOW)).toBe('buyable')
  })
  it('is sold_out when nothing is available', () => {
    expect(ticketStatus(tt({ available: 0 }), NOW)).toBe('sold_out')
  })
  it('is upcoming before the sale starts', () => {
    expect(ticketStatus(tt({ saleStartAt: NOW + 100 }), NOW)).toBe('upcoming')
  })
  it('is ended after the sale ends', () => {
    expect(ticketStatus(tt({ saleEndAt: NOW - 1 }), NOW)).toBe('ended')
  })
  it('treats a missing available count as buyable', () => {
    expect(ticketStatus(tt(), NOW)).toBe('buyable')
  })
})

describe('qtyBounds and clampQty', () => {
  it('uses the smallest of per-order, per-buyer and available', () => {
    const t = tt({ maxPerOrder: 6, maxPerBuyer: 4, available: 10 })
    expect(qtyBounds(t)).toEqual({ min: 1, max: 4 })
  })
  it('treats zero limits as unlimited and caps at 10', () => {
    expect(qtyBounds(tt({ maxPerOrder: 0 }))).toEqual({ min: 1, max: 10 })
  })
  it('respects the minimum per order', () => {
    const t = tt({ minPerOrder: 2, maxPerOrder: 6 })
    expect(clampQty(t, 1)).toBe(2)
    expect(clampQty(t, 9)).toBe(6)
  })
  it('keeps zero as zero and never goes negative', () => {
    expect(clampQty(tt(), 0)).toBe(0)
    expect(clampQty(tt(), -3)).toBe(0)
  })
  it('allows nothing when stock is below the minimum per order', () => {
    const t = tt({ minPerOrder: 2, available: 1 })
    expect(qtyBounds(t).max).toBe(0)
    expect(clampQty(t, 2)).toBe(0)
  })
  it('limits to what is available', () => {
    expect(clampQty(tt({ available: 3 }), 8)).toBe(3)
  })
})

describe('volumeHint', () => {
  const t = tt({ volumeTiers: [{ minQty: 4, unitPriceMinor: 720_000 }] })
  it('is null below the first tier', () => {
    expect(volumeHint(t, 3, 'NGN')).toBeNull()
  })
  it('says what the buyer saves once a tier applies', () => {
    expect(volumeHint(t, 4, 'NGN')).toBe('Buying 4 saves you 10%: -₦3,200')
  })
  it('is null when the tier is not cheaper', () => {
    const same = tt({ volumeTiers: [{ minQty: 2, unitPriceMinor: 800_000 }] })
    expect(volumeHint(same, 5, 'NGN')).toBeNull()
  })
})

describe('isLow', () => {
  it('is true at or below 20 and above 0', () => {
    expect(isLow(tt({ available: 20 }))).toBe(true)
    expect(isLow(tt({ available: 21 }))).toBe(false)
    expect(isLow(tt({ available: 0 }))).toBe(false)
    expect(isLow(tt())).toBe(false)
  })
})

describe('eventSaleState', () => {
  it('is not_on_sale for an event with no ticket types', () => {
    expect(eventSaleState(page([]), NOW)).toBe('not_on_sale')
  })
  it('is not_on_sale when every type is sold out or not yet on sale', () => {
    const types = [tt({ available: 0 }), tt({ id: 't2', saleStartAt: NOW + 5 })]
    expect(eventSaleState(page(types), NOW)).toBe('not_on_sale')
  })
  it('is cancelled for a cancelled event even with ticket types', () => {
    expect(eventSaleState(page([tt()], 'cancelled'), NOW)).toBe('cancelled')
  })
  it('is free when every buyable type costs nothing', () => {
    expect(eventSaleState(page([tt({ priceMinor: 0 })]), NOW)).toBe('free')
  })
  it('is on_sale when something paid is buyable', () => {
    expect(eventSaleState(page([tt()]), NOW)).toBe('on_sale')
  })
})

describe('selected lines and subtotal', () => {
  it('drops zero quantities', () => {
    expect(selectedLines({ a: 2, b: 0, c: 1 })).toEqual([
      { ticketTypeId: 'a', qty: 2 },
      { ticketTypeId: 'c', qty: 1 },
    ])
  })
  it('uses the volume tier price once the quantity qualifies', () => {
    const t = tt({ volumeTiers: [{ minQty: 4, unitPriceMinor: 720_000 }] })
    expect(subtotalMinor([t], { t1: 3 })).toBe(2_400_000)
    expect(subtotalMinor([t], { t1: 4 })).toBe(2_880_000)
  })
})

describe('normaliseTicketType', () => {
  it('turns protojson int64 strings into numbers', () => {
    const t = normaliseTicketType({
      id: 'x',
      name: 'VIP',
      priceMinor: '2500000',
      available: '12',
      maxPerOrder: '6',
      volumeTiers: [{ minQty: '4', unitPriceMinor: '2000000' }],
    })
    expect(t.priceMinor).toBe(2_500_000)
    expect(t.available).toBe(12)
    expect(t.maxPerOrder).toBe(6)
    expect(t.volumeTiers).toEqual([{ minQty: 4, unitPriceMinor: 2_000_000 }])
  })
})

describe('ticket mocks', () => {
  it('does nothing when mocks are disabled', () => {
    expect(withTicketExtras(tt(), false)).toEqual(tt())
  })
  it('fills a description and includes when missing, never overriding real ones', () => {
    const filled = withTicketExtras(tt(), true)
    expect(filled.description).toBeTruthy()
    expect(filled.includes?.length).toBeGreaterThan(0)
    const real = withTicketExtras(tt({ description: 'Real', includes: ['A'] }), true)
    expect(real.description).toBe('Real')
    expect(real.includes).toEqual(['A'])
  })
  it('supplies a buyable, a bundle, a sold out and an upcoming type', () => {
    const types = mockTicketTypes('e1', NOW)
    const statuses = types.map((t) => ticketStatus(t, NOW))
    expect(statuses).toEqual(['buyable', 'buyable', 'sold_out', 'upcoming'])
    expect(types[1].admissionsPerUnit).toBe(2)
  })
})
