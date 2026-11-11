import { describe, expect, it } from 'vitest'
import { PILLARS } from './platform-pillars'

describe('platform pillars', () => {
  it('lists Community, Operations and Commerce, and Community links to /community', () => {
    expect(PILLARS.map((p) => p.title)).toEqual(['Community', 'Operations', 'Commerce'])
    expect(PILLARS.find((p) => p.title === 'Community')?.to).toBe('/community')
  })
})
