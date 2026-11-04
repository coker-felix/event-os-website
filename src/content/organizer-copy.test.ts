import { describe, expect, it } from 'vitest'
import {
  CLOSING,
  HERO,
  HOW_TO_START,
  ORGANIZER_FAQS,
  PERSONAS,
  PILLARS,
  TEASER,
} from './organizer-landing'

function allCopy(): Array<string> {
  const out: Array<string> = []
  const add = (v: unknown) => {
    if (typeof v === 'string') out.push(v)
    else if (Array.isArray(v)) v.forEach(add)
    else if (v && typeof v === 'object') Object.values(v).forEach(add)
  }
  add(HERO)
  add(PILLARS)
  add(PERSONAS)
  add(CLOSING)
  add(HOW_TO_START)
  add(ORGANIZER_FAQS)
  add(TEASER)
  return out
}

// Words the owner asked to keep off the site (no fee copy, no escrow), and
// claims the page has no evidence for (named customers, card-free sign-up).
const BANNED =
  /escrow|guarantee|\bfees?\b|\bpricing\b|no credit card|trusted by|free for free|vendor directory/i

describe('organizer section copy', () => {
  it('has copy to check', () => {
    expect(allCopy().length).toBeGreaterThan(15)
  })

  it('avoids banned or unsupported phrases', () => {
    expect(allCopy().filter((c) => BANNED.test(c))).toEqual([])
  })

  it('asks for the action, not for a sign-up', () => {
    expect(HERO.cta).toBe('Create your event')
    expect(CLOSING.cta).toBe('Create your event')
    expect(allCopy().filter((c) => /sign up|register/i.test(c))).toEqual([])
  })

  it('has four pillars: sell, book, manage and promote', () => {
    expect(PILLARS.map((p) => p.id)).toEqual(['sell', 'book', 'manage', 'promote'])
  })

  it('every persona mentions promoting the event', () => {
    for (const p of PERSONAS) expect(p.points.join(' ')).toMatch(/promot|advert|featured|alerts/i)
  })

  it('has three personas in order, each with at least three points', () => {
    expect(PERSONAS.map((p) => p.id)).toEqual(['promoters', 'corporate', 'community'])
    for (const p of PERSONAS) expect(p.points.length).toBeGreaterThanOrEqual(3)
  })

  it('has three steps to start and at least six questions answered', () => {
    expect(HOW_TO_START).toHaveLength(3)
    expect(ORGANIZER_FAQS.length).toBeGreaterThanOrEqual(6)
    for (const f of ORGANIZER_FAQS) {
      expect(f.question.trim()).not.toBe('')
      expect(f.answer.trim()).not.toBe('')
    }
  })

  it('answers how organizers are paid without escrow or fee wording', () => {
    const q = ORGANIZER_FAQS.find((f) => /paid/i.test(f.question))
    expect(q?.answer).toMatch(/after the event/i)
  })

  it('has a teaser for the attendee page that leads to the organizers page', () => {
    expect(TEASER.cta.length).toBeGreaterThan(0)
    expect(TEASER.heading.length).toBeGreaterThan(0)
  })
})
