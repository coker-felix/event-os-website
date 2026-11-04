import { describe, expect, it } from 'vitest'
import {
  PAGE_SIZE,
  activeFilterChips,
  applyEventsSearch,
  facetCounts,
  paginate,
  validateEventsSearch,
} from './list-search'
import type { PublicEvent } from './types'

// Wed 12 Nov 2025, 10:00 in Lagos (UTC+1) = 09:00 UTC
const NOW = Date.UTC(2025, 10, 12, 9, 0, 0)
const at = (iso: string) => String(Math.floor(Date.parse(iso) / 1000))
const ev = (p: Partial<PublicEvent> & { id: string }): PublicEvent => ({
  title: p.id,
  timezone: 'Africa/Lagos',
  startsAt: at('2025-11-13T18:00:00Z'),
  ...p,
})
const names = new Map([
  [1, 'Music'],
  [2, 'Food & Drink'],
])
const ids = (list: Array<PublicEvent>) => list.map((e) => e.id)

describe('validateEventsSearch', () => {
  it('drops garbage and keeps what is valid', () => {
    expect(
      validateEventsSearch({
        prices: 'abc',
        cats: '1,x',
        page: -3,
        sort: 'nope',
        from: '2025-13-45',
      }),
    ).toEqual({ cats: [1] })
  })

  it('reads arrays and comma-separated strings the same way', () => {
    const a = validateEventsSearch({ cities: ['Lagos', 'Abuja'] })
    const b = validateEventsSearch({ cities: 'Lagos,Abuja' })
    expect(a).toEqual({ cities: ['Lagos', 'Abuja'] })
    expect(b).toEqual(a)
  })

  it('reads a single number, which is how the router parses ?cats=2', () => {
    expect(validateEventsSearch({ cats: 2 })).toEqual({ cats: [2] })
  })

  it('keeps only known price bands, formats, sorts and views', () => {
    expect(
      validateEventsSearch({
        prices: ['free', 'u10', 'x'],
        formats: ['virtual', 'moon'],
        sort: 'price',
        view: 'list',
        when: 'week',
        page: '2',
      }),
    ).toEqual({
      prices: ['free', 'u10'],
      formats: ['virtual'],
      sort: 'price',
      view: 'list',
      when: 'week',
      page: 2,
    })
  })
})

describe('applyEventsSearch', () => {
  const events = [
    ev({ id: 'a', city: 'Lagos', priceFromMinor: 0, categoryId: 1, attendanceType: 'in_person' }),
    ev({ id: 'b', city: 'Abuja', priceFromMinor: 800_000, categoryId: 2, attendanceType: 'virtual' }),
    ev({ id: 'c', city: 'Lagos', priceFromMinor: 3_000_000, categoryId: 1 }),
    ev({ id: 'd', city: 'Lagos', categoryId: 2 }),
  ]

  it('filters by a list of cities', () => {
    expect(ids(applyEventsSearch(events, { cities: ['Abuja'] }, names, NOW))).toEqual(['b'])
    expect(ids(applyEventsSearch(events, { cities: ['Abuja', 'Lagos'] }, names, NOW))).toHaveLength(4)
  })

  it('filters by price band, and an unknown price never matches a band', () => {
    expect(ids(applyEventsSearch(events, { prices: ['free'] }, names, NOW))).toEqual(['a'])
    expect(ids(applyEventsSearch(events, { prices: ['u10'] }, names, NOW))).toEqual(['b'])
    expect(ids(applyEventsSearch(events, { prices: ['o25'] }, names, NOW))).toEqual(['c'])
    expect(ids(applyEventsSearch(events, { prices: ['free', 'u10', '10-25', 'o25'] }, names, NOW))).not.toContain('d')
  })

  it('filters by format and category', () => {
    expect(ids(applyEventsSearch(events, { formats: ['virtual'] }, names, NOW))).toEqual(['b'])
    expect(ids(applyEventsSearch(events, { cats: [2] }, names, NOW))).toEqual(['b', 'd'])
  })

  it('range dates are inclusive and read in the event time zone', () => {
    // 23:30 UTC on the 14th is 00:30 on the 15th in Lagos
    const late = [ev({ id: 'late', startsAt: at('2025-11-14T23:30:00Z') })]
    expect(ids(applyEventsSearch(late, { when: 'range', from: '2025-11-15' }, names, NOW))).toEqual(['late'])
    expect(ids(applyEventsSearch(late, { when: 'range', to: '2025-11-14' }, names, NOW))).toEqual([])
    expect(ids(applyEventsSearch(late, { when: 'range', from: '2025-11-15', to: '2025-11-15' }, names, NOW))).toEqual(['late'])
  })

  it('"week" keeps events starting within 7 days', () => {
    const list = [
      ev({ id: 'soon', startsAt: at('2025-11-14T18:00:00Z') }),
      ev({ id: 'far', startsAt: at('2025-11-30T18:00:00Z') }),
    ]
    expect(ids(applyEventsSearch(list, { when: 'week' }, names, NOW))).toEqual(['soon'])
  })

  it('sorts by price ascending with unknown prices last', () => {
    const out = applyEventsSearch(events, { sort: 'price' }, names, NOW)
    expect(ids(out)).toEqual(['a', 'b', 'c', 'd'])
  })

  it('sorts soonest first by default and newest by createdAt', () => {
    const list = [
      ev({ id: 'later', startsAt: at('2025-11-20T18:00:00Z'), createdAt: at('2025-11-01T00:00:00Z') }),
      ev({ id: 'sooner', startsAt: at('2025-11-13T18:00:00Z'), createdAt: at('2025-10-01T00:00:00Z') }),
    ]
    expect(ids(applyEventsSearch(list, {}, names, NOW))).toEqual(['sooner', 'later'])
    expect(ids(applyEventsSearch(list, { sort: 'newest' }, names, NOW))).toEqual(['later', 'sooner'])
  })

  it('matches text against title and category name', () => {
    const list = [ev({ id: '1', title: 'Jazz Night', categoryId: 1 }), ev({ id: '2', title: 'Street Food', categoryId: 2 })]
    expect(ids(applyEventsSearch(list, { q: 'music' }, names, NOW))).toEqual(['1'])
  })
})

describe('facetCounts', () => {
  const events = [
    ev({ id: 'a', city: 'Lagos', categoryId: 1, priceFromMinor: 0 }),
    ev({ id: 'b', city: 'Lagos', categoryId: 2, priceFromMinor: 800_000 }),
    ev({ id: 'c', city: 'Abuja', categoryId: 1, priceFromMinor: 800_000 }),
  ]

  it('city counts ignore the city filter but respect the category filter', () => {
    const counts = facetCounts(events, { cities: ['Abuja'], cats: [1] }, names, NOW)
    expect(counts.cities.get('Lagos')).toBe(1) // only a is music in Lagos
    expect(counts.cities.get('Abuja')).toBe(1)
  })

  it('counts price bands and categories over the other filters', () => {
    const counts = facetCounts(events, { cities: ['Lagos'] }, names, NOW)
    expect(counts.prices.get('free')).toBe(1)
    expect(counts.prices.get('u10')).toBe(1)
    expect(counts.categories.get(1)).toBe(1)
    expect(counts.categories.get(2)).toBe(1)
  })
})

describe('activeFilterChips', () => {
  it('removing one chip leaves the others and resets the page', () => {
    const s = { cities: ['Lagos', 'Abuja'], prices: ['free' as const], q: 'jazz', page: 3 }
    const chips = activeFilterChips(s, names)
    const lagos = chips.find((c) => c.key === 'city:Lagos')
    expect(chips).toHaveLength(4)
    expect(lagos?.remove(s)).toEqual({ cities: ['Abuja'], prices: ['free'], q: 'jazz' })
  })

  it('removing the last value of a facet drops the facet', () => {
    const s = { cats: [1] }
    const [chip] = activeFilterChips(s, names)
    expect(chip.label).toBe('Music')
    expect(chip.remove(s)).toEqual({})
  })
})

describe('paginate', () => {
  it('returns one page and says whether there is more', () => {
    const items = Array.from({ length: 30 }, (_, i) => i)
    const first = paginate(items, 1)
    expect(first.items).toHaveLength(PAGE_SIZE)
    expect(first.hasMore).toBe(true)
    const last = paginate(items, 3)
    expect(last.items).toHaveLength(30)
    expect(last.hasMore).toBe(false)
  })
})
