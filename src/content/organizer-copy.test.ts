import { describe, expect, it } from 'vitest'
import { CLOSING, HERO, PERSONAS, PILLARS } from './organizer-landing'

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

  it('has three pillars: sell and scan, book and coordinate, manage and budget', () => {
    expect(PILLARS.map((p) => p.id)).toEqual(['sell', 'book', 'manage'])
  })

  it('has three personas in order, each with at least three points', () => {
    expect(PERSONAS.map((p) => p.id)).toEqual(['promoters', 'corporate', 'community'])
    for (const p of PERSONAS) expect(p.points.length).toBeGreaterThanOrEqual(3)
  })
})
