import { describe, expect, it } from 'vitest'
import { prefersReducedMotion, staggerDelay } from './motion'

describe('staggerDelay', () => {
  it('starts at zero and steps by 60ms', () => {
    expect(staggerDelay(0)).toBe(0)
    expect(staggerDelay(3)).toBe(180)
  })
  it('caps at 300ms so long lists do not feel slow', () => {
    expect(staggerDelay(20)).toBe(300)
  })
  it('never goes negative', () => {
    expect(staggerDelay(-2)).toBe(0)
  })
  it('honours a custom step and cap', () => {
    expect(staggerDelay(2, 100, 150)).toBe(150)
    expect(staggerDelay(1, 100, 500)).toBe(100)
  })
})

describe('prefersReducedMotion', () => {
  it('is true when the query matches', () => {
    expect(prefersReducedMotion(() => ({ matches: true }))).toBe(true)
  })
  it('is false when it does not match', () => {
    expect(prefersReducedMotion(() => ({ matches: false }))).toBe(false)
  })
  it('is false, without throwing, when there is no matcher (server)', () => {
    expect(prefersReducedMotion(undefined)).toBe(false)
  })
})
