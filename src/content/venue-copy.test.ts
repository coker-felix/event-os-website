import { describe, expect, it } from 'vitest'
import { VENUE_FAQS } from './venue-faqs'
import {
  AUDIENCES,
  BENEFITS,
  COMING_SOON,
  HERO,
  HOW_TO_START,
} from './venue-landing'

/** Every string the venues landing page can show, with where it came from. */
function allCopy(): Array<{ where: string; text: string }> {
  const out: Array<{ where: string; text: string }> = []
  const add = (where: string, value: unknown) => {
    if (typeof value === 'string') out.push({ where, text: value })
    else if (Array.isArray(value)) value.forEach((v, i) => add(`${where}[${i}]`, v))
    else if (value && typeof value === 'object')
      Object.entries(value).forEach(([k, v]) => add(`${where}.${k}`, v))
  }
  add('HERO', HERO)
  add('AUDIENCES', AUDIENCES)
  add('BENEFITS', BENEFITS)
  add('COMING_SOON', COMING_SOON)
  add('HOW_TO_START', HOW_TO_START)
  add('VENUE_FAQS', VENUE_FAQS)
  return out
}

// Words that would promise something the platform does not do, that the owner
// asked to keep off these pages (no fee copy, no "escrow"), or that would tell
// a visitor they can claim a listing (that flow is behind a flag that is off).
const BANNED =
  /escrow|guarantee|commission|\bfees?\b|\bpricing\b|free to list|free to join|protected deposit|instant(ly)? book|claim your|claim it/i

describe('venues copy honesty', () => {
  it('has copy to check', () => {
    expect(allCopy().length).toBeGreaterThan(20)
  })

  it('never uses a banned or over-promising phrase', () => {
    expect(allCopy().filter((c) => BANNED.test(c.text))).toEqual([])
  })

  it('lists exactly the four things that are real today', () => {
    expect(BENEFITS.map((b) => b.id)).toEqual(['profile', 'calendar', 'contract', 'insights'])
  })

  it('lists exactly the three things that are not live yet, as coming soon', () => {
    expect(COMING_SOON.map((c) => c.id)).toEqual(['protection', 'addons', 'rfp'])
  })

  it('keeps missing features out of the "today" copy', () => {
    const missing = /protection|add-on|request-for-proposal/i
    const today = [
      ...BENEFITS.flatMap((b) => [b.title, b.body]),
      ...AUDIENCES.flatMap((a) => [a.situation, a.today]),
      ...HOW_TO_START.flatMap((s) => [s.title, s.body]),
    ]
    expect(today.filter((t) => missing.test(t))).toEqual([])
  })

  it('speaks to venue owners first and organizers second', () => {
    expect(AUDIENCES.map((a) => a.id)).toEqual(['owner', 'organizer'])
  })

  it('explains that a booking is a request the owner accepts or declines', () => {
    const q = VENUE_FAQS.find((f) => /organizers book/i.test(f.question))
    expect(q?.answer).toMatch(/accept or decline/i)
  })

  it('explains bookable and listing-only without offering a claim flow', () => {
    const q = VENUE_FAQS.find((f) => /bookable/i.test(f.question))
    expect(q?.answer).toMatch(/listing-only/i)
    expect(q?.answer).not.toMatch(/claim/i)
  })

  it('answers "When do I get paid?" without promising payment protection', () => {
    const q = VENUE_FAQS.find((f) => /get paid/i.test(f.question))
    expect(q?.answer).toMatch(/coming soon/i)
  })
})
