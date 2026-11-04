import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { contactPrefill } from './prefill'
import type { Cart } from './types'

const cart = (c: Partial<Cart>) => c as Cart
const remembered = { phone: '+2348012345678', email: 'r@example.com', delivery: 'sms' as const }

describe('contactPrefill', () => {
  it('a cart with a phone wins over remembered details', () => {
    const out = contactPrefill(
      cart({ contactPhone: '+2349000000000', preferredDeliveryChannel: 'sms' }),
      remembered,
    )
    expect(out).toEqual({ phone: '+2349000000000', email: '', delivery: 'sms' })
  })

  it('a cart with only an email uses the email channel', () => {
    const out = contactPrefill(cart({ contactEmail: 'c@example.com' }), remembered)
    expect(out).toEqual({ phone: '', email: 'c@example.com', delivery: 'email' })
  })

  it('uses remembered details when the cart has no contact', () => {
    expect(contactPrefill(cart({}), remembered)).toEqual(remembered)
    expect(contactPrefill(undefined, remembered)).toEqual(remembered)
  })

  it('is empty on sms when there is nothing to use', () => {
    expect(contactPrefill(cart({}), null)).toEqual({ phone: '', email: '', delivery: 'sms' })
  })

  it('moves to the email channel when remembered has no phone', () => {
    const out = contactPrefill(cart({}), { phone: '', email: 'r@example.com', delivery: 'sms' })
    expect(out.delivery).toBe('email')
  })
})

function memoryStorage() {
  const data = new Map<string, string>()
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  }
}

describe('useContact (behind the consent gate)', () => {
  let ls: ReturnType<typeof memoryStorage>
  let cookie = ''
  beforeEach(() => {
    ls = memoryStorage()
    cookie = ''
    vi.stubGlobal('localStorage', ls)
    vi.stubGlobal('document', {
      get cookie() {
        return cookie
      },
      set cookie(v: string) {
        cookie = v.split(';')[0]
      },
    })
    vi.resetModules()
  })
  afterEach(() => vi.unstubAllGlobals())

  async function load() {
    const { useConsent } = await import('#/stores/consent')
    const { useContact } = await import('#/stores/contact')
    return { useConsent, useContact }
  }

  it('writes nothing before a choice, or after decline', async () => {
    const { useConsent, useContact } = await load()
    useConsent.getState().load()
    useContact.getState().remember(remembered)
    expect(ls.data.has('event-os:contact')).toBe(false)
    useConsent.getState().decline()
    useContact.getState().remember(remembered)
    expect(ls.data.has('event-os:contact')).toBe(false)
  })

  it('writes after accept', async () => {
    const { useConsent, useContact } = await load()
    useConsent.getState().accept()
    useContact.getState().remember(remembered)
    expect(JSON.parse(ls.data.get('event-os:contact') ?? '{}').state.remembered).toEqual(remembered)
  })

  it('saves details entered earlier in the visit once the visitor accepts', async () => {
    const { useConsent, useContact } = await load()
    useConsent.getState().load()
    useContact.getState().remember(remembered)
    useConsent.getState().accept()
    expect(ls.data.has('event-os:contact')).toBe(true)
  })

  it('forget() leaves no key behind and empties memory', async () => {
    const { useConsent, useContact } = await load()
    useConsent.getState().accept()
    useContact.getState().remember(remembered)
    useContact.getState().forget()
    expect(ls.data.has('event-os:contact')).toBe(false)
    expect(useContact.getState().remembered).toBeNull()
  })

  it('decline and "Forget my details" clear remembered details at once', async () => {
    const { useConsent, useContact } = await load()
    useConsent.getState().accept()
    useContact.getState().remember(remembered)
    useConsent.getState().forgetDetails()
    expect(ls.data.has('event-os:contact')).toBe(false)
    expect(useContact.getState().remembered).toBeNull()

    useContact.getState().remember(remembered)
    useConsent.getState().decline()
    expect(ls.data.has('event-os:contact')).toBe(false)
    expect(useContact.getState().remembered).toBeNull()
  })
})
