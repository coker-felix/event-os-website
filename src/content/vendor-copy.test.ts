import { describe, expect, it } from 'vitest'
import { VENDOR_FAQS } from './vendor-faqs'
import {
  BENEFITS,
  COMING_SOON,
  HERO,
  HOW_TO_START,
  SCENARIOS,
} from './vendor-landing'

/** Every string the vendors landing page can show, with where it came from. */
function allCopy(): Array<{ where: string; text: string }> {
  const out: Array<{ where: string; text: string }> = []
  const add = (where: string, value: unknown) => {
    if (typeof value === 'string') out.push({ where, text: value })
    else if (Array.isArray(value)) value.forEach((v, i) => add(`${where}[${i}]`, v))
    else if (value && typeof value === 'object')
      Object.entries(value).forEach(([k, v]) => add(`${where}.${k}`, v))
  }
  add('HERO', HERO)
  add('SCENARIOS', SCENARIOS)
  add('BENEFITS', BENEFITS)
  add('COMING_SOON', COMING_SOON)
  add('HOW_TO_START', HOW_TO_START)
  add('VENDOR_FAQS', VENDOR_FAQS)
  return out
}

// Words that would promise something the platform does not do, or that the
// owner asked to keep off these pages (no fee copy, no "escrow").
const BANNED =
  /escrow|guarantee|commission|\bfees?\b|\bpricing\b|free to join|paid the next day|protected payment/i

describe('vendors copy honesty', () => {
  it('has copy to check', () => {
    expect(allCopy().length).toBeGreaterThan(20)
  })

  it('never uses a banned or over-promising phrase', () => {
    const hits = allCopy().filter((c) => BANNED.test(c.text))
    expect(hits).toEqual([])
  })

  it('lists exactly the four things that are real today', () => {
    expect(BENEFITS.map((b) => b.id)).toEqual(['calendar', 'contract', 'verified', 'start'])
  })

  it('lists exactly the three things that are not live yet, as coming soon', () => {
    expect(COMING_SOON.map((c) => c.id)).toEqual(['protection', 'headcount', 'rfp'])
  })

  it('keeps missing features out of the "today" copy', () => {
    const missing = /headcount|request-for-proposal|payment protection|protection/i
    const today = [
      ...BENEFITS.flatMap((b) => [b.title, b.body]),
      ...SCENARIOS.flatMap((s) => [s.situation, s.today]),
      ...HOW_TO_START.flatMap((h) => [h.title, h.body]),
    ]
    expect(today.filter((t) => missing.test(t))).toEqual([])
  })

  it('names a missing feature only through a "soon" field, which the page tags as coming soon', () => {
    const withSoon = SCENARIOS.filter((s) => s.soon)
    expect(withSoon.length).toBeGreaterThan(0)
    for (const s of withSoon) expect(s.soon).toBeTruthy()
  })

  it('answers "When do I get paid?" without promising payment protection', () => {
    const q = VENDOR_FAQS.find((f) => /get paid/i.test(f.question))
    expect(q?.answer).toMatch(/coming soon/i)
    expect(q?.answer).toMatch(/KYC/)
  })

  it('has one scenario each for the solo operator, caterer and production house', () => {
    expect(SCENARIOS.map((s) => s.id)).toEqual(['solo', 'caterer', 'production'])
  })
})
