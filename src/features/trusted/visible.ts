import { safeHttpsUrl } from '#/lib/url'

export interface TrustedBrand {
  name: string
  /** An https URL, or a file served from this site such as "/logos/acme.svg". */
  logo?: string
  /** The brand's website. https only. */
  href?: string
  kind?: 'organizer' | 'brand' | 'sponsor'
}

const MAX = 12

/** A logo may be an https URL or a root-relative file, nothing else. */
export function safeLogoSrc(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  if (/^\/(?![/\\])[^\s]*$/.test(raw)) return raw
  return safeHttpsUrl(raw) ?? undefined
}

/** Clean the list: named, de-duplicated, safe links, at most 12. */
export function visibleBrands(list: Array<TrustedBrand>): Array<TrustedBrand> {
  const seen = new Set<string>()
  const out: Array<TrustedBrand> = []
  for (const b of list) {
    const name = b.name.trim()
    const key = name.toLowerCase()
    if (!name || seen.has(key)) continue
    seen.add(key)
    out.push({
      name,
      logo: safeLogoSrc(b.logo),
      href: b.href ? (safeHttpsUrl(b.href) ?? undefined) : undefined,
      kind: b.kind,
    })
    if (out.length === MAX) break
  }
  return out
}
