import { safeLogoSrc } from '#/features/trusted/visible'

export type TestimonialAudience = 'organizers' | 'vendors' | 'venues' | 'attendees'

export interface Testimonial {
  quote: string
  name: string
  /** For example "Promoter" or "Caterer". */
  role: string
  company?: string
  audience: TestimonialAudience
  /** An https URL, or a file served from this site such as "/people/ama.jpg". */
  photo?: string
}

const MAX = 3
const MAX_QUOTE = 280

/**
 * The testimonials for one audience: named, de-duplicated, at most three. A
 * quote over 280 characters is left out, never cut, so nobody is misquoted.
 */
export function visibleTestimonials(
  list: Array<Testimonial>,
  audience: TestimonialAudience,
): Array<Testimonial> {
  const seen = new Set<string>()
  const out: Array<Testimonial> = []
  for (const t of list) {
    if (t.audience !== audience) continue
    const quote = t.quote.trim()
    const name = t.name.trim()
    if (!quote || !name || quote.length > MAX_QUOTE || seen.has(quote)) continue
    seen.add(quote)
    out.push({
      ...t,
      quote,
      name,
      role: t.role.trim(),
      company: t.company?.trim() || undefined,
      photo: safeLogoSrc(t.photo),
    })
    if (out.length === MAX) break
  }
  return out
}
