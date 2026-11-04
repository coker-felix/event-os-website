import { describe, expect, it } from 'vitest'
import { isOrganizerId } from './ids'
import {
  normaliseOrganizer,
  normalisePastEvent,
  normaliseReview,
  normaliseReviewSummary,
} from './normalise'

const ID = '11111111-1111-4111-8111-111111111111'

describe('isOrganizerId', () => {
  it('accepts a UUID and nothing else', () => {
    expect(isOrganizerId(ID)).toBe(true)
    expect(isOrganizerId('512activity')).toBe(false)
    expect(isOrganizerId('')).toBe(false)
  })
})

describe('normaliseOrganizer', () => {
  it('needs an id and a name', () => {
    expect(normaliseOrganizer({ id: ID })).toBeNull()
    expect(normaliseOrganizer({ name: 'X' })).toBeNull()
    expect(normaliseOrganizer(null)).toBeNull()
    expect(normaliseOrganizer({ id: ID, name: '  Sunset Club ' })?.name).toBe('Sunset Club')
  })
  it('drops an unsafe logo and caps the bio', () => {
    const o = normaliseOrganizer({
      id: ID,
      name: 'X',
      logoUrl: 'javascript:alert(1)',
      bio: 'a'.repeat(900),
    })
    expect(o?.logoUrl).toBeUndefined()
    expect(o?.bio?.length).toBe(600)
  })
  it('keeps an https logo', () => {
    expect(normaliseOrganizer({ id: ID, name: 'X', logoUrl: 'https://x.test/a.png' })?.logoUrl).toBe(
      'https://x.test/a.png',
    )
  })
})

describe('normalisePastEvent', () => {
  it('keeps safe photos only, at most 12, and a safe video', () => {
    const e = normalisePastEvent({
      id: ID,
      title: 'Beach Party',
      photos: [
        'https://x.test/1.jpg',
        'http://x.test/2.jpg',
        'javascript:1',
        ...Array.from({ length: 20 }, (_, i) => `https://x.test/p${i}.jpg`),
      ],
      videoUrl: 'https://x.test/v',
    })
    expect(e?.photos.every((p) => p.startsWith('https://'))).toBe(true)
    expect(e?.photos.length).toBe(12)
    expect(e?.videoUrl).toBe('https://x.test/v')
  })
  it('drops a bad video and a bad accent colour; needs id and title', () => {
    const e = normalisePastEvent({ id: ID, title: 'T', videoUrl: 'ftp://x', accentColor: 'red' })
    expect(e?.videoUrl).toBeUndefined()
    expect(e?.accentColor).toBeUndefined()
    expect(normalisePastEvent({ id: ID })).toBeNull()
  })
})

describe('normaliseReview', () => {
  it('needs a whole rating from 1 to 5', () => {
    expect(normaliseReview({ id: 'r', rating: 0 })).toBeNull()
    expect(normaliseReview({ id: 'r', rating: 6 })).toBeNull()
    expect(normaliseReview({ id: 'r', rating: 3.5 })).toBeNull()
    expect(normaliseReview({ id: 'r', rating: '4' })).toBeNull()
    expect(normaliseReview({ id: 'r', rating: 4 })?.rating).toBe(4)
  })
  it('trims text and caps it at 500 characters', () => {
    expect(normaliseReview({ id: 'r', rating: 5, text: '  great  ' })?.text).toBe('great')
    expect(normaliseReview({ id: 'r', rating: 5, text: 'a'.repeat(700) })?.text.length).toBe(500)
  })
})

describe('normaliseReviewSummary', () => {
  it('is null with no reviews', () => {
    expect(normaliseReviewSummary({ count: 0, average: 0 })).toBeNull()
    expect(normaliseReviewSummary(undefined)).toBeNull()
  })
  it('clamps the average, and shows at most 3 usable quotes', () => {
    const s = normaliseReviewSummary({
      count: 40,
      average: 9,
      reviews: [
        { id: '1', rating: 5, text: 'a' },
        { id: '2', rating: 0, text: 'bad' },
        { id: '3', rating: 4, text: 'b' },
        { id: '4', rating: 4, text: 'c' },
        { id: '5', rating: 3, text: 'd' },
      ],
    })
    expect(s?.average).toBe(5)
    expect(s?.count).toBe(40)
    expect(s?.recent.map((r) => r.id)).toEqual(['1', '3', '4'])
  })
})
