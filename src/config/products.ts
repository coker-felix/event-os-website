export type ProductId = 'attendees' | 'vendors' | 'venues'

export interface NavItem {
  label: string
  to: string
  /** Jump to a section on the target page. */
  hash?: string
}

/** A button in the header that leads into the vendor portal. */
export interface HeaderAction {
  label: string
  /** Path inside the portal, for example "/login". */
  path: string
  variant: 'primary' | 'secondary'
}

export interface Product {
  id: ProductId
  name: string
  tagline: string
  home: string
  nav: Array<NavItem>
  actions?: Array<HeaderAction>
}

export const PRODUCTS: Record<ProductId, Product> = {
  attendees: {
    id: 'attendees',
    name: 'Event OS',
    tagline: 'Find events and get tickets',
    home: '/',
    nav: [
      { label: 'Events', to: '/events' },
      { label: 'Host an event', to: '/', hash: 'organizers' },
      { label: 'Blog', to: '/blog' },
      { label: 'Ticket help', to: '/tickets/help' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  vendors: {
    id: 'vendors',
    name: 'Event OS for Vendors',
    tagline: 'Get booked at great events',
    home: '/vendors',
    nav: [
      { label: 'Callouts', to: '/vendors/callouts' },
      { label: 'Directory', to: '/vendors/directory' },
    ],
    actions: [
      { label: 'Sign in', path: '/login', variant: 'secondary' },
      { label: 'Create profile', path: '/register', variant: 'primary' },
    ],
  },
  venues: {
    id: 'venues',
    name: 'Event OS for Venues',
    tagline: 'Fill your venue with events',
    home: '/venues',
    nav: [{ label: 'Directory', to: '/venues/directory' }],
    actions: [
      { label: 'Sign in', path: '/login', variant: 'secondary' },
      { label: 'List your venue', path: '/register', variant: 'primary' },
    ],
  },
}
