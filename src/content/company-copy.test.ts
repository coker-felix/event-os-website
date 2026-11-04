import { describe, expect, it } from 'vitest'
import { ABOUT, COMPANY } from './company'

const texts = (): Array<string> => [
  ABOUT.headline,
  ABOUT.intro,
  ...ABOUT.why,
  ...ABOUT.products.flatMap((p) => [p.name, p.body]),
]

// Superlatives and claims the site has no evidence for, plus the words kept off the site.
const BANNED =
  /escrow|guarantee|\bfees?\b|\bpricing\b|\bbest\b|leading|#1|number one|award|biggest|largest|million/i

describe('about copy', () => {
  it('has copy to check', () => {
    expect(texts().length).toBeGreaterThan(8)
  })
  it('makes no superlative or unsupported claim', () => {
    expect(texts().filter((t) => BANNED.test(t))).toEqual([])
  })
  it('describes all four products and links each to its page', () => {
    expect(ABOUT.products.map((p) => p.to)).toEqual(['/events', '/vendors', '/venues', '/organizers'])
  })
  it('keeps facts we cannot know optional and empty until filled in', () => {
    expect(COMPANY.founded).toBeUndefined()
    expect(COMPANY.location).toBeUndefined()
  })
})
