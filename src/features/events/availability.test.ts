import { describe, expect, it } from 'vitest'
import { availabilityBadge } from './availability'

describe('availabilityBadge', () => {
  it('labels a sold out event', () => {
    expect(availabilityBadge('sold_out')).toBe('Sold out')
  })

  it('labels low availability as selling fast', () => {
    expect(availabilityBadge('low')).toBe('Selling fast')
  })

  it('shows nothing for plenty or unknown availability', () => {
    expect(availabilityBadge('available')).toBeNull()
    expect(availabilityBadge(undefined)).toBeNull()
  })
})
