import { describe, expect, it } from 'vitest'
import { mailtoLink, telLink, whatsappLink } from './config'
import { MAX_MESSAGE, mockReference, validateContactForm } from './form'
import { supportStatus } from './hours'

// 2025-11-10 is a Monday. Lagos is UTC+1 with no daylight saving.
const at = (iso: string) => new Date(iso)

describe('supportStatus (Mon to Fri, 9 AM to 6 PM, Lagos)', () => {
  it('is open in the middle of a working day', () => {
    expect(supportStatus(at('2025-11-12T11:00:00Z'))).toEqual({
      open: true,
      label: "We're online now",
    })
  })

  it('opens exactly at 9 AM and closes exactly at 6 PM', () => {
    expect(supportStatus(at('2025-11-12T08:00:00Z')).open).toBe(true) // 09:00
    expect(supportStatus(at('2025-11-12T16:59:00Z')).open).toBe(true) // 17:59
    expect(supportStatus(at('2025-11-12T17:00:00Z')).open).toBe(false) // 18:00
  })

  it('before opening on a working day says back today', () => {
    expect(supportStatus(at('2025-11-10T07:59:00Z'))).toEqual({
      open: false,
      label: 'Back today at 9 AM',
    })
  })

  it('after closing Monday to Thursday says back tomorrow', () => {
    expect(supportStatus(at('2025-11-11T17:30:00Z'))).toEqual({
      open: false,
      label: 'Back tomorrow at 9 AM',
    })
  })

  it('after closing on Friday says back Monday', () => {
    expect(supportStatus(at('2025-11-14T17:01:00Z')).label).toBe('Back Monday at 9 AM')
  })

  it('on a weekend says back Monday', () => {
    expect(supportStatus(at('2025-11-15T09:00:00Z'))).toEqual({
      open: false,
      label: 'Back Monday at 9 AM',
    })
  })

  it('on a Sunday says back tomorrow, because Monday is the next day', () => {
    expect(supportStatus(at('2025-11-16T12:00:00Z')).label).toBe('Back tomorrow at 9 AM')
  })

  it('reads the day in the support time zone, not the visitor’s', () => {
    // 23:30 UTC on Friday is 00:30 Saturday in Lagos: weekend.
    expect(supportStatus(at('2025-11-14T23:30:00Z')).label).toBe('Back Monday at 9 AM')
  })

  it('formats half hours', () => {
    const hours = { days: [1, 2, 3, 4, 5], open: '09:30', close: '18:00', timeZone: 'Africa/Lagos' }
    expect(supportStatus(at('2025-11-10T07:00:00Z'), hours).label).toBe('Back today at 9:30 AM')
  })
})

describe('validateContactForm', () => {
  const valid = {
    topic: 'tickets_orders',
    name: 'Ada',
    contact: 'ada@example.com',
    message: 'I cannot find my ticket.',
  }

  it('accepts a complete form and cleans the contact', () => {
    const res = validateContactForm({ ...valid, contact: '+234 801 234 5678', orderRef: ' #4821 ' })
    expect(res).toEqual({
      ok: true,
      value: {
        topic: 'tickets_orders',
        name: 'Ada',
        contact: '+2348012345678',
        orderRef: '#4821',
        message: 'I cannot find my ticket.',
      },
    })
  })

  it('flags an empty message', () => {
    const res = validateContactForm({ ...valid, message: '   ' })
    expect(res.ok === false && res.errors.message).toBeTruthy()
  })

  it('flags a message over the limit but accepts exactly the limit', () => {
    const over = validateContactForm({ ...valid, message: 'x'.repeat(MAX_MESSAGE + 1) })
    expect(over.ok === false && over.errors.message).toMatch(/2000/)
    expect(validateContactForm({ ...valid, message: 'x'.repeat(MAX_MESSAGE) }).ok).toBe(true)
  })

  it('flags a contact that is neither an email nor a phone number', () => {
    const res = validateContactForm({ ...valid, contact: 'abc' })
    expect(res.ok === false && res.errors.contact).toBeTruthy()
  })

  it('flags a missing name and an unknown topic', () => {
    const res = validateContactForm({ ...valid, name: '', topic: 'nope' })
    expect(res.ok === false && Object.keys(res.errors).sort()).toEqual(['name', 'topic'])
  })

  it('leaves an empty order number out', () => {
    const res = validateContactForm({ ...valid, orderRef: '  ' })
    expect(res.ok && 'orderRef' in res.value).toBe(false)
  })
})

describe('mockReference', () => {
  it('is C- followed by five digits, and stable for the same seed', () => {
    expect(mockReference('hello')).toMatch(/^C-\d{5}$/)
    expect(mockReference('hello')).toBe(mockReference('hello'))
    expect(mockReference('hello')).not.toBe(mockReference('world'))
  })
})

describe('contact links', () => {
  it('builds a WhatsApp link from digits only', () => {
    expect(whatsappLink('+234 801 234 5678')).toBe('https://wa.me/2348012345678')
  })

  it('keeps the leading plus on a tel link and drops spaces', () => {
    expect(telLink('+234 801 234 5678')).toBe('tel:+2348012345678')
    expect(telLink('0801 234 5678')).toBe('tel:08012345678')
  })

  it('builds a mailto link', () => {
    expect(mailtoLink('help@example.com')).toBe('mailto:help@example.com')
  })

  it('returns null for an empty value so the button can be hidden', () => {
    expect(whatsappLink(undefined)).toBeNull()
    expect(telLink('')).toBeNull()
    expect(mailtoLink(undefined)).toBeNull()
  })
})
