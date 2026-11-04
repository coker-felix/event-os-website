import { describe, expect, it } from 'vitest'
import { formatPrice } from './money'

describe('formatPrice', () => {
  it('shows the amount without a currency symbol', () => {
    expect(formatPrice(500000)).toBe('5,000')
    expect(formatPrice(250050)).toBe('2,500.50')
    expect(formatPrice(500000, 'USD')).toBe('5,000')
  })
  it('keeps Free for zero and null for unknown', () => {
    expect(formatPrice(0)).toBe('Free')
    expect(formatPrice(undefined)).toBeNull()
  })
})
