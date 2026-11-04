import { describe, expect, it } from 'vitest'
import { FOOTER_COLUMNS, LEGAL_LINKS } from './footer'

interface Link {
  label: string
  to?: string
  hash?: string
  portal?: string
  action?: string
}
const links = FOOTER_COLUMNS.flatMap((c) => c.links as ReadonlyArray<Link>)
const internal = links.filter((l): l is Link & { to: string } => !!l.to)

const REAL_ROUTES = [
  '/',
  '/events',
  '/blog',
  '/tickets/help',
  '/contact',
  '/vendors',
  '/vendors/callouts',
  '/vendors/directory',
  '/venues',
  '/venues/directory',
  '/terms',
  '/privacy',
  '/cookies',
]

describe('footer', () => {
  it('has no duplicate internal links', () => {
    const keys = internal.map((l) => `${l.to}#${l.hash ?? ''}`)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('links the three legal pages', () => {
    const to = (LEGAL_LINKS as ReadonlyArray<Link>).flatMap((l) => (l.to ? [l.to] : []))
    expect(to).toEqual(['/terms', '/privacy', '/cookies'])
  })

  it('sends organizers to create an event and sign in, through the portal', () => {
    const col = FOOTER_COLUMNS.find((c) => c.heading === 'Organizers')
    expect(col?.links).toEqual([
      { label: 'Create an event', portal: '/register' },
      { label: 'Organizer sign in', portal: '/login' },
    ])
  })

  it('only links to routes that exist', () => {
    expect(internal.filter((l) => !REAL_ROUTES.includes(l.to))).toEqual([])
  })

  it('has the six columns', () => {
    expect(FOOTER_COLUMNS.map((c) => c.heading)).toEqual([
      'Explore',
      'Vendors',
      'Venues',
      'Organizers',
      'Help',
      'Legal',
    ])
  })
})
