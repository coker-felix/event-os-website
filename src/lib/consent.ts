import type { StateStorage } from 'zustand/middleware'

export const CONSENT_VERSION = 1
export type ConsentChoice = 'accepted' | 'declined'

/** Cookie value: `<choice>.<version>.<unix seconds>`. */
export function serializeConsent(
  choice: ConsentChoice,
  nowMs: number,
  version: number = CONSENT_VERSION,
): string {
  return `${choice}.${version}.${Math.floor(nowMs / 1000)}`
}

/** The stored choice, or null when missing, malformed or from another version. */
export function parseConsent(
  value: string | undefined,
  version: number = CONSENT_VERSION,
): ConsentChoice | null {
  if (!value) return null
  const [choice, v] = value.split('.')
  if (choice !== 'accepted' && choice !== 'declined') return null
  if (Number(v) !== version) return null
  return choice
}

export function readCookie(
  cookieHeader: string,
  name: string,
): string | undefined {
  for (const part of cookieHeader.split(';')) {
    const [k, ...rest] = part.trim().split('=')
    if (k === name) return rest.join('=')
  }
  return undefined
}

export function consentCookie(
  value: string,
  maxAgeDays = 365,
  secure = false,
): string {
  return [
    `eos_consent=${value}`,
    `Max-Age=${maxAgeDays * 86400}`,
    'Path=/',
    'SameSite=Lax',
    ...(secure ? ['Secure'] : []),
  ].join('; ')
}

/** Reads and removals always pass; writes only while `canWrite()` is true. */
export function createGatedStorage(
  canWrite: () => boolean,
  inner: StateStorage,
): StateStorage {
  return {
    getItem: (name) => inner.getItem(name),
    setItem: (name, value) => {
      if (canWrite()) void inner.setItem(name, value)
    },
    removeItem: (name) => inner.removeItem(name),
  }
}

/**
 * The banner is fixed to the bottom of the screen, which on the checkout page
 * is where the mobile pay bar sits. Checkout has its own "Cookie settings"
 * prompt, so the banner stays off that one page.
 */
export function showBannerOn(pathname: string): boolean {
  return !/^\/events\/[^/]+\/checkout\/?$/.test(pathname)
}
