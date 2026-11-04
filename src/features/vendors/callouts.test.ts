import { describe, expect, it } from 'vitest'
import {
  calloutCategories,
  calloutTitle,
  closesInLabel,
  filterCallouts,
  joinCalloutsWithEvents,
  serviceKindLabel,
} from './callouts'
import { isVendorId } from './ids'
import { portalUrl } from './portal'
import type { Callout } from './types'
import type { PublicEvent } from '#/features/events/types'

const callout = (p: Partial<Callout> & { id: string }): Callout => ({
  eventId: 'e1',
  category: 'catering',
  serviceKinds: [],
  ...p,
})
const event = (p: Partial<PublicEvent> & { id: string }): PublicEvent => ({
  title: `Event ${p.id}`,
  ...p,
})

describe('joinCalloutsWithEvents', () => {
  it('attaches the event a callout belongs to', () => {
    const cards = joinCalloutsWithEvents(
      [callout({ id: 'c1', eventId: 'e2' })],
      [event({ id: 'e1' }), event({ id: 'e2', title: 'Rooftop Night' })],
    )
    expect(cards[0].event?.title).toBe('Rooftop Night')
  })

  it('leaves the event out when it is not in the list, or the list is empty', () => {
    const missing = joinCalloutsWithEvents(
      [callout({ id: 'c1', eventId: 'nope' })],
      [event({ id: 'e1' })],
    )
    expect(missing[0].event).toBeUndefined()
    expect(joinCalloutsWithEvents([callout({ id: 'c1' })], [])[0].event).toBeUndefined()
  })
})

describe('calloutTitle', () => {
  it('uses the event title when the event is known', () => {
    const card = { callout: callout({ id: 'c1' }), event: event({ id: 'e1', title: 'Rooftop Night' }) }
    expect(calloutTitle(card)).toBe('Rooftop Night')
  })

  it('falls back to "Open callout · category" with no event', () => {
    expect(calloutTitle({ callout: callout({ id: 'c1', category: 'sound' }) })).toBe(
      'Open callout · sound',
    )
  })
})

describe('closesInLabel', () => {
  const NOW = 1_800_000_000
  const DAY = 86_400

  it('has no label when the closing time is missing or zero', () => {
    expect(closesInLabel(undefined, NOW)).toBeNull()
    expect(closesInLabel(0, NOW)).toBeNull()
  })

  it('says Closed once the time has passed', () => {
    expect(closesInLabel(NOW - 1, NOW)).toBe('Closed')
    expect(closesInLabel(NOW, NOW)).toBe('Closed')
    expect(closesInLabel(NOW - 3 * DAY, NOW)).toBe('Closed')
  })

  it('says Closes today inside the last 24 hours', () => {
    expect(closesInLabel(NOW + 3600, NOW)).toBe('Closes today')
    expect(closesInLabel(NOW + DAY - 1, NOW)).toBe('Closes today')
  })

  it('counts whole days, singular for one', () => {
    expect(closesInLabel(NOW + 36 * 3600, NOW)).toBe('Closes in 1 day')
    expect(closesInLabel(NOW + 3.5 * DAY, NOW)).toBe('Closes in 3 days')
  })

  it('never produces a negative number or NaN', () => {
    for (const closesAt of [NOW - 10 * DAY, NOW - 1, NOW + 1, NOW + 40 * DAY]) {
      const label = closesInLabel(closesAt, NOW) ?? ''
      expect(label).not.toMatch(/-|NaN/)
    }
  })
})

describe('serviceKindLabel', () => {
  it('turns a snake_case kind into a readable label', () => {
    expect(serviceKindLabel('check_in_assistance')).toBe('Check in assistance')
    expect(serviceKindLabel('headphones')).toBe('Headphones')
  })

  it('returns an empty string for an empty kind', () => {
    expect(serviceKindLabel('')).toBe('')
  })
})

describe('calloutCategories and filterCallouts', () => {
  const cards = [
    { callout: callout({ id: '1', category: 'catering' }), event: event({ id: 'a', city: 'Accra' }) },
    { callout: callout({ id: '2', category: 'sound' }), event: event({ id: 'b', city: 'Lagos' }) },
    { callout: callout({ id: '3', category: 'catering' }), event: undefined },
  ]

  it('lists each category once, in the order first seen', () => {
    expect(calloutCategories(cards)).toEqual(['catering', 'sound'])
  })

  it('filters by category', () => {
    expect(filterCallouts(cards, { category: 'catering' }).map((c) => c.callout.id)).toEqual(['1', '3'])
  })

  it('filters by the event city, and a card with no event never matches a city', () => {
    expect(filterCallouts(cards, { city: 'Lagos' }).map((c) => c.callout.id)).toEqual(['2'])
    expect(filterCallouts(cards, { city: 'Accra', category: 'sound' })).toEqual([])
  })

  it('returns everything with no filters', () => {
    expect(filterCallouts(cards, {})).toHaveLength(3)
  })
})

describe('portalUrl', () => {
  it('joins the base and the path with exactly one slash', () => {
    expect(portalUrl('/register', 'http://localhost:5173/')).toBe('http://localhost:5173/register')
    expect(portalUrl('login', 'https://portal.example.com')).toBe('https://portal.example.com/login')
  })
})

describe('isVendorId', () => {
  it('accepts a UUID in either case', () => {
    expect(isVendorId('32db6ca3-dabf-469f-adca-02dce5641c18')).toBe(true)
    expect(isVendorId('32DB6CA3-DABF-469F-ADCA-02DCE5641C18')).toBe(true)
  })

  it('rejects anything else', () => {
    expect(isVendorId('does-not-exist')).toBe(false)
    expect(isVendorId('')).toBe(false)
    expect(isVendorId('32db6ca3-dabf-469f-adca-02dce5641c18-x')).toBe(false)
  })
})
