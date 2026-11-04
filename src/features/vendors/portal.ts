/** Where vendors sign up and sign in: the vendor portal (event-os-ui). */
const DEFAULT_BASE =
  import.meta.env.VITE_VENDOR_PORTAL_URL ?? 'http://localhost:5173'

/** A link into the vendor portal, with exactly one slash between base and path. */
export function portalUrl(path: string, base: string = DEFAULT_BASE): string {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}
