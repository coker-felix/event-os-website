import { describe, expect, it } from 'vitest'
import { availabilityFromError } from './availability'
import { isVenueId } from './ids'
import { mockHeldBlocks, mockVenueProfile, mockVenues } from './mocks'
import { upcomingBlocks } from './venues'
import { ApiError } from '#/lib/api'

const NOW = 1_800_000_000

describe('mock venues', () => {
  it('has six venues with stable ids that pass isVenueId', () => {
    const venues = mockVenues()
    expect(venues).toHaveLength(6)
    expect(venues.every((v) => isVenueId(v.id))).toBe(true)
    expect(mockVenues().map((v) => v.id)).toEqual(venues.map((v) => v.id))
  })

  it('mixes bookable and listing-only venues, with capacities and places', () => {
    const venues = mockVenues()
    expect(venues.some((v) => v.claimed)).toBe(true)
    expect(venues.some((v) => !v.claimed)).toBe(true)
    expect(venues.every((v) => v.city && v.country && (v.capacity ?? 0) > 0)).toBe(true)
  })
})

describe('mockVenueProfile', () => {
  it('returns a full profile for a mock id whose claimed flag matches the list', () => {
    for (const v of mockVenues()) {
      const p = mockVenueProfile(v.id)
      expect(p?.name).toBe(v.name)
      expect(p?.claimed).toBe(v.claimed)
      expect(p?.amenities.length).toBeGreaterThan(0)
    }
  })

  it('returns null for any other id', () => {
    expect(mockVenueProfile('32db6ca3-dabf-469f-adca-02dce5641c18')).toBeNull()
  })
})

describe('mockHeldBlocks', () => {
  it('gives a claimed venue upcoming held dates and an unclaimed one none', () => {
    const claimed = mockVenues().find((v) => v.claimed)
    const unclaimed = mockVenues().find((v) => !v.claimed)
    expect(upcomingBlocks(mockHeldBlocks(claimed?.id ?? '', NOW), NOW).length).toBeGreaterThanOrEqual(2)
    expect(mockHeldBlocks(unclaimed?.id ?? '', NOW)).toEqual([])
  })
})

describe('availabilityFromError', () => {
  it('reads a 409 as "not open", which is not an error (unclaimed or inactive venue)', () => {
    expect(availabilityFromError(new ApiError(409, 'conflict', null))).toEqual({
      open: false,
      blocks: [],
    })
  })

  it('rethrows anything else', () => {
    const notFound = new ApiError(404, 'nf', null)
    expect(() => availabilityFromError(notFound)).toThrow(notFound)
    const network = new TypeError('Failed to fetch')
    expect(() => availabilityFromError(network)).toThrow(network)
  })
})
