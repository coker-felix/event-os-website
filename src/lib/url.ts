/**
 * Links that come from the API (organizer-supplied sponsor sites, banner
 * links, the payment page) are untrusted: a `javascript:` or `data:` URL in
 * a link would run when someone clicks it. These helpers let only http(s)
 * through.
 */

/** The trimmed URL if it is an absolute http(s) URL, otherwise null. */
export function safeHttpUrl(raw: string | undefined): string | null {
  const value = raw?.trim()
  if (!value) return null
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:' ? value : null
  } catch {
    return null
  }
}

/** Like `safeHttpUrl`, but https only. Used for the payment redirect. */
export function safeHttpsUrl(raw: string | undefined): string | null {
  const value = safeHttpUrl(raw)
  return value && new URL(value).protocol === 'https:' ? value : null
}

/** A path on this site ("/events") or an absolute http(s) URL. */
export function isSafeHref(href: string): boolean {
  if (href.startsWith('/')) {
    // "//host" and "/\host" are read by browsers as another site.
    return !href.startsWith('//') && !href.startsWith('/\\')
  }
  return safeHttpUrl(href) !== null
}
