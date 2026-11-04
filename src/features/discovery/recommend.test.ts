import { describe, expect, it } from 'vitest'
import { recommendFor } from './recommend'
import type { PublicEvent } from '#/features/events/types'

const NOW = 1_800_000_000
const DAY = 86400
const ev = (id: string, o: Partial<PublicEvent> = {}): PublicEvent => ({
  id,
  title: id,
  startsAt: NOW + DAY,
  ...o,
})
const names = new Map([
  [1, 'Beach'],
  [2, 'Music'],
])

describe('recommendFor', () => {
  it('is empty when nothing is saved or followed', () => {
    expect(
      recommendFor({ events: [ev('a', { categoryId: 1 })], saved: [], followed: [], categoryNames: names, nowSec: NOW }),
    ).toEqual([])
  })

  it('suggests upcoming events in the category you saved most, not the ones you saved', () => {
    const events = [
      ev('s1', { categoryId: 1 }),
      ev('s2', { categoryId: 1 }),
      ev('s3', { categoryId: 2 }),
      ev('b1', { categoryId: 1, startsAt: NOW + 3 * DAY }),
      ev('b2', { categoryId: 1, startsAt: NOW + 2 * DAY }),
      ev('m1', { categoryId: 2 }),
      ev('old', { categoryId: 1, startsAt: NOW - DAY }),
    ]
    const rows = recommendFor({ events, saved: ['s1', 's2', 's3'], followed: [], categoryNames: names, nowSec: NOW })
    expect(rows).toHaveLength(1)
    expect(rows[0].title).toBe('Because you saved Beach events')
    expect(rows[0].events.map((e) => e.id)).toEqual(['b2', 'b1'])
  })

  it('breaks a tie between categories by the lower id', () => {
    const events = [ev('a', { categoryId: 2 }), ev('b', { categoryId: 1 }), ev('x1', { categoryId: 1 }), ev('x2', { categoryId: 2 })]
    const rows = recommendFor({ events, saved: ['a', 'b'], followed: [], categoryNames: names, nowSec: NOW })
    expect(rows[0].title).toBe('Because you saved Beach events')
  })

  it('ignores saved ids that are no longer in the list, and categories with no name', () => {
    const events = [ev('a', { categoryId: 9 }), ev('z', { categoryId: 9 })]
    expect(recommendFor({ events, saved: ['gone', 'a'], followed: [], categoryNames: names, nowSec: NOW })).toEqual([])
  })

  it('lists upcoming events from followed organizers first, and does not repeat them', () => {
    const events = [
      ev('s1', { categoryId: 1 }),
      ev('f1', { categoryId: 1, organizerId: 'org-1', startsAt: NOW + 5 * DAY }),
      ev('f0', { organizerId: 'org-1', startsAt: NOW + 2 * DAY }),
      ev('past', { organizerId: 'org-1', startsAt: NOW - DAY }),
      ev('other', { categoryId: 1 }),
    ]
    const rows = recommendFor({ events, saved: ['s1'], followed: ['org-1'], categoryNames: names, nowSec: NOW })
    expect(rows.map((r) => r.title)).toEqual(['From organizers you follow', 'Because you saved Beach events'])
    expect(rows[0].events.map((e) => e.id)).toEqual(['f0', 'f1'])
    expect(rows[1].events.map((e) => e.id)).toEqual(['other'])
  })

  it('caps each row at 8', () => {
    const events = Array.from({ length: 20 }, (_, i) => ev(`f${i}`, { organizerId: 'o', startsAt: NOW + (i + 1) * DAY }))
    expect(recommendFor({ events, saved: [], followed: ['o'], categoryNames: names, nowSec: NOW })[0].events).toHaveLength(8)
  })
})
