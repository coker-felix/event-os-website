import { describe, expect, it } from 'vitest'
import { mockOrderStatus, nextPollDelay, parseReturnParams } from './order-status'

describe('parseReturnParams', () => {
  it('has no reference or order for an empty or junk query', () => {
    expect(parseReturnParams({}, false)).toEqual({})
    expect(parseReturnParams({ reference: 42, order: ['x'], trxref: 'y' }, false)).toEqual({})
  })

  it('reads the Paystack reference and our order id', () => {
    expect(parseReturnParams({ reference: 'ref_1', trxref: 'ref_1' }, false)).toEqual({
      reference: 'ref_1',
    })
    expect(parseReturnParams({ order: 'o1' }, false)).toEqual({ order: 'o1' })
  })

  it('ignores a blank reference', () => {
    expect(parseReturnParams({ reference: '   ' }, false)).toEqual({})
  })

  it('ignores ?outcome= unless mocks are enabled', () => {
    expect(parseReturnParams({ order: 'o1', outcome: 'paid' }, false)).toEqual({ order: 'o1' })
    expect(parseReturnParams({ order: 'o1', outcome: 'paid' }, true)).toEqual({
      order: 'o1',
      outcome: 'paid',
    })
  })

  it('ignores an unknown outcome even with mocks on', () => {
    expect(parseReturnParams({ order: 'o1', outcome: 'banana' }, true)).toEqual({ order: 'o1' })
  })
})

describe('nextPollDelay', () => {
  it('waits 2s, 3s, 5s, then 10s between checks', () => {
    expect([0, 1, 2, 3, 4].map(nextPollDelay)).toEqual([2000, 3000, 5000, 10_000, 10_000])
  })

  it('stops once the total wait would pass 3 minutes', () => {
    expect(nextPollDelay(19)).toBe(10_000) // 180s in total: still allowed
    expect(nextPollDelay(20)).toBeNull() // 190s in total
    expect(nextPollDelay(500)).toBeNull()
  })
})

describe('mockOrderStatus', () => {
  it('builds each outcome with the order id and a numeric total', () => {
    for (const outcome of ['paid', 'pending', 'failed'] as const) {
      const s = mockOrderStatus({ order: 'o1', outcome })
      expect(s.status).toBe(outcome)
      expect(s.orderId).toBe('o1')
      expect(typeof s.total).toBe('number')
    }
  })

  it('uses the reference when there is no order id, and defaults to pending', () => {
    const s = mockOrderStatus({ reference: 'ref_1' })
    expect(s.status).toBe('pending')
    expect(s.orderId).toBe('ref_1')
  })
})
