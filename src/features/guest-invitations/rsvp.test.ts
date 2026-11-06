import { describe, expect, it } from 'vitest'
import { clampPartySize, invitationView } from './rsvp'

describe('guest invitation views', () => {
  it.each([
    ['loading', { loadState: 'loading' }, 'loading'],
    ['not found', { loadState: 'not-found' }, 'not-found'],
    ['not enabled', { loadState: 'not-enabled' }, 'not-enabled'],
    ['error', { loadState: 'error' }, 'error'],
    ['closed invitation', { loadState: 'ready', closed: true, status: 'going' }, 'closed'],
    ['opted out', { loadState: 'ready', status: 'opted_out' }, 'opted-out'],
    ['active invitation', { loadState: 'ready', status: 'invited' }, 'active'],
  ] as const)('returns the %s state', (_label, input, result) => {
    expect(invitationView(input)).toBe(result)
  })
})

describe('party size bounds', () => {
  it('clamps values to one through maxPartySize', () => {
    expect(clampPartySize(0, 4)).toBe(1)
    expect(clampPartySize(2.9, 4)).toBe(2)
    expect(clampPartySize(7, 4)).toBe(4)
    expect(clampPartySize(4, 0)).toBe(1)
  })
})
