import { parseContact } from '#/features/alerts/subscribe'
import { ApiError, apiPost } from '#/lib/api'
import { MOCKS_ENABLED, hash } from '#/lib/mocks'

export const CONTACT_TOPICS = [
  { id: 'tickets_orders', label: 'My tickets or an order' },
  { id: 'refunds', label: 'Refunds' },
  { id: 'vendor', label: 'Vendors' },
  { id: 'venue', label: 'Venues' },
  { id: 'organizer', label: 'Organizing events' },
  { id: 'other', label: 'Other' },
] as const

export type ContactTopic = (typeof CONTACT_TOPICS)[number]['id']

export const MAX_MESSAGE = 2000

export interface ContactInput {
  topic: ContactTopic
  name: string
  /** A cleaned email address or phone number. */
  contact: string
  orderRef?: string
  message: string
}

type Field = 'topic' | 'name' | 'contact' | 'message'

export type ContactFormResult =
  | { ok: true; value: ContactInput }
  | { ok: false; errors: Partial<Record<Field, string>> }

export function validateContactForm(input: {
  topic: string
  name: string
  contact: string
  orderRef?: string
  message: string
}): ContactFormResult {
  const errors: Partial<Record<Field, string>> = {}
  const topic = CONTACT_TOPICS.find((t) => t.id === input.topic)?.id
  if (!topic) errors.topic = 'Choose what this is about.'
  const name = input.name.trim()
  if (!name) errors.name = 'Enter your name.'
  const contact = parseContact(input.contact)
  if (!contact) errors.contact = 'Enter a valid email address or phone number.'
  const message = input.message.trim()
  if (!message) errors.message = 'Tell us how we can help.'
  else if (message.length > MAX_MESSAGE)
    errors.message = `Keep your message under ${MAX_MESSAGE} characters.`
  if (!topic || !name || !contact || !message || errors.message) {
    return { ok: false, errors }
  }
  const orderRef = input.orderRef?.trim()
  return {
    ok: true,
    value: { topic, name, contact, ...(orderRef ? { orderRef } : {}), message },
  }
}

/** Invented reference for dev: "C-" and five digits, stable for a seed. */
export function mockReference(seed: string): string {
  return `C-${String(hash(seed) % 100_000).padStart(5, '0')}`
}

/**
 * Proposed `POST /api/v1/contact` (backend request section 6). In dev, when
 * the endpoint does not exist, it pretends to succeed with an invented
 * reference. `reference` is empty if the API does not return one.
 */
export async function submitContact(
  value: ContactInput,
): Promise<{ reference: string }> {
  try {
    const res = await apiPost<{ reference?: string } | null>('/api/v1/contact', value)
    return { reference: typeof res?.reference === 'string' ? res.reference : '' }
  } catch (err) {
    const missing = err instanceof ApiError && err.status === 404
    if (MOCKS_ENABLED && (missing || !(err instanceof ApiError))) {
      return { reference: mockReference(`${value.message}${Date.now()}`) }
    }
    throw err
  }
}
