import { describe, expect, it } from 'vitest'
import { isVenueId } from './ids'
import {
  normaliseBlocks,
  normaliseVenueEntry,
  normaliseVenueList,
  normaliseVenueProfile,
} from './normalise'
import { validateVenuesSearch } from './search'
import {
  CAPACITY_STEPS,
  filterVenues,
  formatHeldRange,
  safeSocialLinks,
  sortVenues,
  upcomingBlocks,
  venueCities,
  venueCountries,
} from './venues'
import type { HeldBlock, VenueEntry } from './types'

const ts = (y: number, m: number, d: number, h = 0) => Date.UTC(y, m - 1, d, h) / 1000
const venue = (p: Partial<VenueEntry> & { id: string }): VenueEntry => ({
  name: p.id,
  claimed: false,
  ...p,
})

describe('normaliseVenueEntry', () => {
  it('reads the real list shape: int64 strings become numbers', () => {
    expect(
      normaliseVenueEntry({ id: 'v1', name: 'Hall', city: 'Accra', country: 'GH', capacity: '250', claimed: true }),
    ).toEqual({
      id: 'v1',
      name: 'Hall',
      city: 'Accra',
      country: 'GH',
      capacity: 250,
      claimed: true,
      category: undefined,
      imageUrl: undefined,
    })
  })

  it('treats a missing claimed flag as unclaimed (protojson omits false)', () => {
    expect(normaliseVenueEntry({ id: 'v', name: 'Hall' }).claimed).toBe(false)
    expect(normaliseVenueEntry({ id: 'v', name: 'Hall', claimed: 'yes' }).claimed).toBe(false)
  })

  it('treats a missing, zero or junk capacity as not listed', () => {
    expect(normaliseVenueEntry({ id: 'v', name: 'H' }).capacity).toBeUndefined()
    expect(normaliseVenueEntry({ id: 'v', name: 'H', capacity: '0' }).capacity).toBeUndefined()
    expect(normaliseVenueEntry({ id: 'v', name: 'H', capacity: 'lots' }).capacity).toBeUndefined()
  })
})

describe('normaliseVenueList', () => {
  it('turns both empty shapes into an empty list that has no more', () => {
    expect(normaliseVenueList({ venues: [], total: 0 }, 12)).toEqual({ venues: [], hasMore: false })
    expect(normaliseVenueList({}, 12)).toEqual({ venues: [], hasMore: false })
  })

  it('follows the total when there is one, else a full page', () => {
    const rows = Array.from({ length: 12 }, (_, i) => ({ id: `v${i}`, name: `V${i}` }))
    expect(normaliseVenueList({ venues: rows, total: '30' }, 12).hasMore).toBe(true)
    expect(normaliseVenueList({ venues: rows, total: 12 }, 12).hasMore).toBe(false)
    expect(normaliseVenueList({ venues: rows }, 12).hasMore).toBe(true)
    expect(normaliseVenueList({ venues: rows.slice(0, 3) }, 12).hasMore).toBe(false)
  })
})

describe('normaliseVenueProfile', () => {
  it('reads amenities, links and rating, and defaults the lists', () => {
    const p = normaliseVenueProfile({
      id: 'v1',
      name: 'Hall',
      address: '1 High St',
      capacity: '400',
      amenities: ['Parking', 'Stage'],
      rating: 4.5,
      ratingCount: '8',
      claimed: true,
      websiteUrl: 'https://hall.example',
      socialLinks: { instagram: 'https://instagram.com/hall', empty: '' },
    })
    expect(p.amenities).toEqual(['Parking', 'Stage'])
    expect(p.capacity).toBe(400)
    expect(p.rating).toBe(4.5)
    expect(p.ratingCount).toBe(8)
    expect(p.claimed).toBe(true)
    expect(p.socialLinks).toEqual({ instagram: 'https://instagram.com/hall' })
    const bare = normaliseVenueProfile({ id: 'v2', name: 'Bare', rating: 0, ratingCount: 0 })
    expect(bare.amenities).toEqual([])
    expect(bare.socialLinks).toEqual({})
    expect(bare.rating).toBeUndefined()
    expect(bare.claimed).toBe(false)
  })
})

describe('normaliseBlocks', () => {
  it('reads a missing list as none and converts int64 strings', () => {
    expect(normaliseBlocks({})).toEqual([])
    expect(normaliseBlocks({ blocks: [{ id: 'b', fromAt: '100', toAt: '200' }] })).toEqual([
      { id: 'b', fromAt: 100, toAt: 200 },
    ])
  })
})

describe('filterVenues and sortVenues', () => {
  const venues = [
    venue({ id: 'a', name: 'Beach Hall', city: 'Accra', country: 'GH', capacity: 500, claimed: true }),
    venue({ id: 'b', name: 'Atrium', city: 'Lagos', country: 'NG', capacity: 120 }),
    venue({ id: 'c', name: 'Cedar Room', city: 'Accra', country: 'GH', claimed: true }),
    venue({ id: 'd', name: 'dome', city: 'Lagos', country: 'NG', capacity: 1500, claimed: true }),
  ]
  const ids = (v: Array<VenueEntry>) => v.map((x) => x.id)

  it('filters by city, country and bookable', () => {
    expect(ids(filterVenues(venues, { city: 'Lagos' }))).toEqual(['b', 'd'])
    expect(ids(filterVenues(venues, { country: 'GH' }))).toEqual(['a', 'c'])
    expect(ids(filterVenues(venues, { bookableOnly: true }))).toEqual(['a', 'c', 'd'])
  })

  it('applies a minimum capacity, and a venue with no capacity never passes it', () => {
    expect(ids(filterVenues(venues, { minCapacity: 300 }))).toEqual(['a', 'd'])
    expect(ids(filterVenues(venues, { minCapacity: 100 }))).toEqual(['a', 'b', 'd'])
  })

  it('combines filters, and passes everything with none', () => {
    expect(ids(filterVenues(venues, { city: 'Accra', bookableOnly: true, minCapacity: 300 }))).toEqual(['a'])
    expect(filterVenues(venues, {})).toHaveLength(4)
  })

  it('sorts bookable venues first, then by name ignoring case, without changing the input', () => {
    const copy = [...venues]
    expect(ids(sortVenues(venues))).toEqual(['a', 'c', 'd', 'b'])
    expect(venues).toEqual(copy)
  })

  it('lists distinct cities and countries in order', () => {
    expect(venueCities(venues)).toEqual(['Accra', 'Lagos'])
    expect(venueCountries(venues)).toEqual(['GH', 'NG'])
  })

  it('has the three capacity steps', () => {
    expect(CAPACITY_STEPS.map((s) => s.min)).toEqual([100, 300, 1000])
    expect(CAPACITY_STEPS.map((s) => s.label)).toEqual(['100+', '300+', '1000+'])
  })
})

describe('upcomingBlocks', () => {
  const NOW = ts(2026, 11, 20)
  const block = (id: string, from: number, to: number): HeldBlock => ({ id, fromAt: from, toAt: to })

  it('drops a block that ends at or before it starts', () => {
    expect(upcomingBlocks([block('flat', ts(2026, 12, 1), ts(2026, 12, 1)), block('back', ts(2026, 12, 5), ts(2026, 12, 2))], NOW)).toEqual([])
  })

  it('drops blocks already over, keeps one in progress, drops one past the window', () => {
    const blocks = [
      block('past', ts(2026, 11, 1), ts(2026, 11, 5)),
      block('now', ts(2026, 11, 18), ts(2026, 11, 22)),
      block('soon', ts(2026, 12, 10), ts(2026, 12, 12)),
      block('far', ts(2027, 6, 1), ts(2027, 6, 3)),
    ]
    expect(upcomingBlocks(blocks, NOW).map((b) => b.id)).toEqual(['now', 'soon'])
  })

  it('sorts by start and honours a different window', () => {
    const blocks = [block('b', ts(2026, 12, 20), ts(2026, 12, 22)), block('a', ts(2026, 12, 2), ts(2026, 12, 3))]
    expect(upcomingBlocks(blocks, NOW).map((b) => b.id)).toEqual(['a', 'b'])
    expect(upcomingBlocks(blocks, NOW, 20).map((b) => b.id)).toEqual(['a'])
  })

  it('copes with no blocks', () => {
    expect(upcomingBlocks([], NOW)).toEqual([])
  })
})

describe('formatHeldRange', () => {
  it('one day', () => {
    expect(formatHeldRange(ts(2026, 12, 12), ts(2026, 12, 13))).toBe('12 Dec 2026')
  })
  it('within a month', () => {
    expect(formatHeldRange(ts(2026, 12, 12, 18), ts(2026, 12, 14, 6))).toBe('12 to 14 Dec 2026')
  })
  it('a range ending at midnight reads as the day before', () => {
    expect(formatHeldRange(ts(2026, 12, 12), ts(2026, 12, 14))).toBe('12 to 13 Dec 2026')
  })
  it('across months and across years', () => {
    expect(formatHeldRange(ts(2026, 11, 30), ts(2026, 12, 3))).toBe('30 Nov to 2 Dec 2026')
    expect(formatHeldRange(ts(2026, 12, 30), ts(2027, 1, 3))).toBe('30 Dec 2026 to 2 Jan 2027')
  })
})

describe('safeSocialLinks', () => {
  it('keeps only http(s) links and sorts by platform', () => {
    expect(
      safeSocialLinks({
        twitter: 'https://x.com/hall',
        bad: 'javascript:alert(1)',
        facebook: 'https://facebook.com/hall',
        rel: '/relative',
      }),
    ).toEqual([
      { platform: 'facebook', url: 'https://facebook.com/hall' },
      { platform: 'twitter', url: 'https://x.com/hall' },
    ])
  })
})

describe('validateVenuesSearch', () => {
  it('trims text and drops blanks', () => {
    expect(validateVenuesSearch({ city: ' Accra ', country: '' })).toEqual({ city: 'Accra' })
  })

  it('keeps only the capacity steps, from a number or a string', () => {
    expect(validateVenuesSearch({ minCapacity: 300 })).toEqual({ minCapacity: 300 })
    expect(validateVenuesSearch({ minCapacity: '1000' })).toEqual({ minCapacity: 1000 })
    expect(validateVenuesSearch({ minCapacity: 250 })).toEqual({})
    expect(validateVenuesSearch({ minCapacity: 'abc' })).toEqual({})
  })

  it('keeps bookable only when it is true', () => {
    expect(validateVenuesSearch({ bookable: true })).toEqual({ bookable: true })
    expect(validateVenuesSearch({ bookable: 'true' })).toEqual({ bookable: true })
    expect(validateVenuesSearch({ bookable: false })).toEqual({})
    expect(validateVenuesSearch({ bookable: 'no' })).toEqual({})
  })

  it('keeps a page above 1 and drops junk', () => {
    expect(validateVenuesSearch({ page: 3 })).toEqual({ page: 3 })
    expect(validateVenuesSearch({ page: 1 })).toEqual({})
    expect(validateVenuesSearch({ page: -2 })).toEqual({})
    expect(validateVenuesSearch({ page: 'abc', city: ['x'] })).toEqual({})
  })

  it('round-trips a clean search', () => {
    const clean = { city: 'Accra', country: 'GH', minCapacity: 300 as const, bookable: true as const, page: 2 }
    expect(validateVenuesSearch(clean)).toEqual(clean)
  })
})

describe('isVenueId', () => {
  it('accepts a UUID and rejects anything else', () => {
    expect(isVenueId('32db6ca3-dabf-469f-adca-02dce5641c18')).toBe(true)
    expect(isVenueId('does-not-exist')).toBe(false)
    expect(isVenueId('')).toBe(false)
  })
})
