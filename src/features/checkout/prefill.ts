import type { ContactValue } from '#/components/checkout/contact-section'
import type { Cart } from './types'

export interface Remembered {
  phone: string
  email: string
  delivery: 'sms' | 'email'
}

/** The channel to use: the preferred one if its field is filled, else the other. */
function channelFor(
  phone: string,
  email: string,
  preferred: string | undefined,
): 'sms' | 'email' {
  if (preferred === 'email' && email) return 'email'
  if (preferred === 'sms' && phone) return 'sms'
  return phone ? 'sms' : email ? 'email' : 'sms'
}

/**
 * What the contact fields start with. A cart that already has contact details
 * wins; otherwise the details remembered on this device; otherwise empty.
 */
export function contactPrefill(
  cart: Cart | undefined,
  remembered: Remembered | null,
): ContactValue {
  const phone = cart?.contactPhone ?? ''
  const email = cart?.contactEmail ?? ''
  if (phone || email) {
    return {
      phone,
      email,
      delivery: channelFor(phone, email, cart?.preferredDeliveryChannel),
    }
  }
  if (remembered && (remembered.phone || remembered.email)) {
    return {
      phone: remembered.phone,
      email: remembered.email,
      delivery: channelFor(remembered.phone, remembered.email, remembered.delivery),
    }
  }
  return { phone: '', email: '', delivery: 'sms' }
}
