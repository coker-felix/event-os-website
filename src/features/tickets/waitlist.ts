import { apiPost } from '#/lib/api'
import { parseContact } from '#/features/alerts/subscribe'

export interface WaitlistPayload {
  eventId: string
  ticketTypeId: string
  phone?: string
  email?: string
}

/** Body for `POST /api/v1/waitlist`, or null when the contact is invalid. */
export function waitlistPayload(
  eventId: string,
  ticketTypeId: string,
  contact: string,
): WaitlistPayload | null {
  const cleaned = parseContact(contact)
  if (!cleaned) return null
  return cleaned.includes('@')
    ? { eventId, ticketTypeId, email: cleaned }
    : { eventId, ticketTypeId, phone: cleaned }
}

/** Join a ticket type's "notify me" waitlist. Resolves false for a bad contact. */
export async function joinWaitlist(
  eventId: string,
  ticketTypeId: string,
  contact: string,
): Promise<boolean> {
  const payload = waitlistPayload(eventId, ticketTypeId, contact)
  if (!payload) return false
  await apiPost('/api/v1/waitlist', payload)
  return true
}
