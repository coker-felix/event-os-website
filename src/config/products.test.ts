import { describe, expect, it } from 'vitest'
import { PRODUCTS } from './products'

describe('products', () => {
  it('has four products in switcher order, organizers last', () => {
    expect(Object.keys(PRODUCTS)).toEqual(['attendees', 'vendors', 'venues', 'organizers'])
  })

  it('gives organizers their own home, nav and sign-up action', () => {
    const o = PRODUCTS.organizers
    expect(o.home).toBe('/organizers')
    expect(o.nav.length).toBeGreaterThan(0)
    expect(o.actions).toEqual([
      { label: 'Sign in', path: '/login', variant: 'secondary' },
      { label: 'Create your event', path: '/register', variant: 'primary' },
    ])
  })

  it('points the attendee "Host an event" link at the organizers page', () => {
    const link = PRODUCTS.attendees.nav.find((n) => n.label === 'Host an event')
    expect(link?.to).toBe('/organizers')
    expect(link?.hash).toBeUndefined()
  })
})
