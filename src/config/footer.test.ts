import { describe, expect, it } from 'vitest'
import { FOOTER_COLUMNS, LEGAL_LINKS } from './footer'

interface Link {
  label: string
  to?: string
  hash?: string
  portal?: string
  action?: string
  when?: string
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
  '/organizers',
  '/about',
  '/about/team',
  '/careers',
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

  it('sends organizers to their page, then to create an event and sign in, through the portal', () => {
    const col = FOOTER_COLUMNS.find((c) => c.heading === 'Organizers')
    expect(col?.links).toEqual([
      { label: 'For organizers', to: '/organizers' },
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
      'Company',
      'Help',
      'Legal',
    ])
  })

  it('has a Company column with About, Team, Careers and Contact', () => {
    const col = FOOTER_COLUMNS.find((c) => c.heading === 'Company')
    expect(col?.links).toEqual([
      { label: 'About us', to: '/about' },
      { label: 'Our team', to: '/about/team', when: 'team' },
      { label: 'Careers', to: '/careers', when: 'careers' },
      { label: 'Contact us', to: '/contact' },
    ])
  })

  it('keeps Contact us out of the Help column so it is not listed twice', () => {
    const help = FOOTER_COLUMNS.find((c) => c.heading === 'Help')
    expect((help?.links as ReadonlyArray<Link>).map((l) => l.to)).not.toContain('/contact')
  })
})
