import { apiPost } from '#/lib/api'
import { MOCKS_ENABLED } from '#/lib/mocks'

/**
 * Proposed contract: `POST /api/v1/alerts/subscribe` with
 * `{ contact: string, city?: string }`, 2xx on success.
 * With mocks enabled it pretends to succeed without calling the API.
 */
export async function subscribeToAlerts(input: {
  contact: string
  city?: string | null
}): Promise<void> {
  if (MOCKS_ENABLED) {
    await new Promise((r) => setTimeout(r, 600))
    return
  }
  await apiPost('/api/v1/alerts/subscribe', {
    contact: input.contact,
    ...(input.city ? { city: input.city } : {}),
  })
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Returns the cleaned contact (email or phone) or null when invalid. */
export function parseContact(raw: string): string | null {
  const v = raw.trim()
  if (EMAIL.test(v)) return v
  const digits = v.replace(/[\s()-]/g, '')
  return /^\+?\d{8,15}$/.test(digits) ? digits : null
}
