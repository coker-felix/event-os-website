import { describe, expect, it } from 'vitest'
import { communityLinks } from './links'

describe('communityLinks', () => {
  it('encodes the use blueprint redirect once', () => {
    expect(communityLinks.useBlueprint('abc')).toBe('http://localhost:5173/login?portal=organizer&redirect=%2Forganizer%2Fcommunity%2Fblueprints%2Fabc%3Ffork%3D1')
  })
  it('rejects unsupported report types', () => {
    expect(() => communityLinks.report('thread', 'abc')).toThrow()
  })
})
