import { describe, expect, it } from 'vitest'
import { PRODUCTS } from './products'

describe('products', () => {
  it('includes the community product after the existing products', () => {
    expect(Object.keys(PRODUCTS)).toEqual(['attendees', 'organizers', 'vendors', 'venues', 'community'])
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

  it('keeps the organizers brand short so the navbar does not wrap', () => {
    expect(PRODUCTS.organizers.name).toBe('EventRail')
  })
})
