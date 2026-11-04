import { describe, expect, it } from 'vitest'
import { COOKIES } from '#/content/legal/cookies'
import { PRIVACY } from '#/content/legal/privacy'
import { TERMS } from '#/content/legal/terms'
import { STORAGE } from '#/lib/storage-registry'
import {
  AUDIENCES,
  draftNoticeVisible,
  filterSections,
  placeholdersIn,
  validateLegalSearch,
} from './legal'
import type { LegalDoc } from '#/content/legal/types'

const DOCS: Array<LegalDoc> = [TERMS, PRIVACY, COOKIES]
const text = (d: LegalDoc) =>
  [d.title, d.intro, ...d.sections.flatMap((s) => [s.heading, ...s.body])].join('\n')

describe('filterSections', () => {
  it.each(DOCS.map((d) => [d.slug, d] as const))(
    '%s: an audience sees "all" plus its own sections, and none of the others',
    (_slug, doc) => {
      for (const a of AUDIENCES) {
        const shown = filterSections(doc, a.id)
        expect(shown.length).toBeGreaterThan(0)
        expect(shown.every((s) => s.audience === 'all' || s.audience === a.id)).toBe(true)
        expect(shown.some((s) => s.audience === a.id)).toBe(true)
      }
    },
  )

  it('shows everything when no audience is chosen', () => {
    expect(filterSections(TERMS, undefined)).toEqual(TERMS.sections)
  })
})

describe('legal documents', () => {
  it.each(DOCS.map((d) => [d.slug, d] as const))('%s has unique section ids', (_s, doc) => {
    const ids = doc.sections.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(DOCS.map((d) => [d.slug, d] as const))(
    '%s leaves business decisions as visible placeholders',
    (_s, doc) => {
      expect(placeholdersIn(doc).length).toBeGreaterThan(0)
    },
  )

  it.each(DOCS.map((d) => [d.slug, d] as const))(
    '%s promises nothing the product does not do and names no company or country',
    (_s, doc) => {
      expect(text(doc)).not.toMatch(
        /escrow|guarantee|payment protection|fully secure|100%|nigeria|lagos|ghana|kenya|\bltd\b|\bllc\b|\binc\b/i,
      )
    },
  )

  it('the Cookies page lists every storage key and says there is no tracking or advertising', () => {
    const t = text(COOKIES)
    for (const s of Object.values(STORAGE)) expect(t).toContain(s.key)
    expect(t).toMatch(/no tracking/i)
    expect(t).toMatch(/advertising/i)
  })

  it('the Privacy page covers each kind of data the product collects, and Paystack', () => {
    const t = text(PRIVACY)
    for (const word of [/phone/i, /email/i, /order/i, /support message/i, /profile/i, /KYC/, /Paystack/])
      expect(t).toMatch(word)
  })

  it('the Terms say vendor payouts wait for KYC and do not promise vendor payment protection', () => {
    const t = text(TERMS)
    expect(t).toMatch(/held until[^.]*KYC/i)
    expect(t).not.toMatch(/vendors? (are|is) (paid|protected)/i)
  })
})

describe('draftNoticeVisible', () => {
  it('shows for anything except an explicit "true"', () => {
    expect(draftNoticeVisible(undefined)).toBe(true)
    expect(draftNoticeVisible('')).toBe(true)
    expect(draftNoticeVisible('false')).toBe(true)
    expect(draftNoticeVisible('true')).toBe(false)
  })
})

describe('validateLegalSearch', () => {
  it('keeps a known audience and drops junk', () => {
    expect(validateLegalSearch({ for: 'vendors' })).toEqual({ for: 'vendors' })
    expect(validateLegalSearch({ for: 'junk' })).toEqual({})
    expect(validateLegalSearch({ for: 5 })).toEqual({})
    expect(validateLegalSearch({ for: ['vendors'] })).toEqual({})
    expect(validateLegalSearch(null)).toEqual({})
  })
})
