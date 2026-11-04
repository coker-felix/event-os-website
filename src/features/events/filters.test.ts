import { describe, expect, it } from 'vitest'
import { withEventExtras } from './enrich'
import { citiesOf, filterEvents, matchesQuick } from './filters'
import type { PublicEvent } from './types'

// Wed 12 Nov 2025, 10:00 in Lagos (UTC+1) = 09:00 UTC
const NOW = Date.UTC(2025, 10, 12, 9, 0, 0)
const at = (iso: string) => String(Math.floor(Date.parse(iso) / 1000))
const ev = (p: Partial<PublicEvent> & { id: string }): PublicEvent => ({
  title: p.id,
  timezone: 'Africa/Lagos',
  ...p,
})
const none = new Map<number, string>()

describe('matchesQuick', () => {
  it('tonight: same calendar day in the event time zone', () => {
    // 23:30 Lagos on the 12th is 22:30 UTC, still "today" in Lagos
    expect(
      matchesQuick(ev({ id: 'a', startsAt: at('2025-11-12T22:30:00Z') }), 'tonight', NOW),
    ).toBe(true)
    // 00:30 Lagos on the 13th is 23:30 UTC on the 12th: tomorrow in Lagos
    expect(
      matchesQuick(ev({ id: 'b', startsAt: at('2025-11-12T23:30:00Z') }), 'tonight', NOW),
    ).toBe(false)
  })

  it('weekend: Fri/Sat/Sun within 7 days, not midweek', () => {
    const sat = ev({ id: 's', startsAt: at('2025-11-15T18:00:00Z') })
    const thu = ev({ id: 't', startsAt: at('2025-11-13T18:00:00Z') })
    const nextSat = ev({ id: 'n', startsAt: at('2025-11-22T18:00:00Z') })
    expect(matchesQuick(sat, 'weekend', NOW)).toBe(true)
    expect(matchesQuick(thu, 'weekend', NOW)).toBe(false)
    expect(matchesQuick(nextSat, 'weekend', NOW)).toBe(false)
  })

  it('free: only price 0, not unknown price', () => {
    expect(matchesQuick(ev({ id: 'f', priceFromMinor: 0 }), 'free', NOW)).toBe(true)
    expect(matchesQuick(ev({ id: 'p', priceFromMinor: 500 }), 'free', NOW)).toBe(false)
    expect(matchesQuick(ev({ id: 'u' }), 'free', NOW)).toBe(false)
  })
})

describe('filterEvents', () => {
  const events = [
    ev({ id: '1', title: 'Jazz in the Garden', city: 'Lagos', categoryId: 1 }),
    ev({ id: '2', title: 'Street Food Night', city: 'Abuja', categoryId: 2 }),
    ev({ id: '3', title: 'Comedy Live', city: 'Lagos', categoryId: 3 }),
  ]

  it('combines city, category and text', () => {
    expect(filterEvents(events, { city: 'Lagos' }, none, NOW).map((e) => e.id)).toEqual(['1', '3'])
    expect(filterEvents(events, { categoryId: 2 }, none, NOW).map((e) => e.id)).toEqual(['2'])
    expect(filterEvents(events, { q: 'live comedy' }, none, NOW).map((e) => e.id)).toEqual(['3'])
  })

  it('matches the category name in text search', () => {
    const names = new Map([[2, 'Food & Drink']])
    expect(filterEvents(events, { q: 'drink' }, names, NOW).map((e) => e.id)).toEqual(['2'])
  })

  it('returns everything with no filters', () => {
    expect(filterEvents(events, {}, none, NOW)).toHaveLength(3)
  })
})

describe('citiesOf', () => {
  it('orders by event count, then name', () => {
    const list = [{ city: 'Lagos' }, { city: 'Abuja' }, { city: 'Lagos' }, {}].map((x, i) =>
      ev({ id: String(i), ...x }),
    )
    expect(citiesOf(list)).toEqual(['Lagos', 'Abuja'])
  })
})

describe('withEventExtras', () => {
  const base = ev({ id: 'evt-1' })

  it('does nothing when mocks are disabled', () => {
    expect(withEventExtras(base, false)).toEqual(base)
  })

  it('is stable for the same event', () => {
    expect(withEventExtras(base, true)).toEqual(withEventExtras(base, true))
  })

  it('never overrides real values', () => {
    const real = ev({ id: 'evt-1', priceFromMinor: 123, venueName: 'Real Hall', city: 'Kano', soldOut: false })
    const out = withEventExtras(real, true)
    expect(out.priceFromMinor).toBe(123)
    expect(out.venueName).toBe('Real Hall')
    expect(out.city).toBe('Kano')
    expect(out.soldOut).toBe(false)
  })
})
