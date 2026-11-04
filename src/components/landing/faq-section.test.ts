import { describe, expect, it } from 'vitest'
import { VENDOR_FAQS } from '#/content/vendor-faqs'
import { faqJsonLd } from './faq-section'
import type { Faq } from '#/content/faqs'

interface JsonLd {
  '@type': string
  mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>
}

describe('faqJsonLd', () => {
  it('describes one question per entry as FAQPage data', () => {
    const data = JSON.parse(faqJsonLd(VENDOR_FAQS)) as JsonLd
    expect(data['@type']).toBe('FAQPage')
    expect(data.mainEntity).toHaveLength(VENDOR_FAQS.length)
    expect(data.mainEntity[0].name).toBe(VENDOR_FAQS[0].question)
  })

  it('escapes < so a question or answer cannot close the script tag', () => {
    const faqs: Array<Faq> = [{ question: 'Is 1 < 2?', answer: '</script><b>x</b>' }]
    const out = faqJsonLd(faqs)
    expect(out).not.toContain('<')
    expect(out).toContain('\\u003c/script>')
  })

  it('defaults to the attendee FAQs when given nothing', () => {
    const data = JSON.parse(faqJsonLd()) as JsonLd
    expect(data.mainEntity.length).toBeGreaterThan(3)
  })
})
