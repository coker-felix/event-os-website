export type ProductId = 'attendees' | 'vendors' | 'venues'

export interface NavItem {
  label: string
  to: string
}

export interface Product {
  id: ProductId
  name: string
  tagline: string
  home: string
  nav: Array<NavItem>
}

export const PRODUCTS: Record<ProductId, Product> = {
  attendees: {
    id: 'attendees',
    name: 'Event OS',
    tagline: 'Find events and get tickets',
    home: '/',
    nav: [
      { label: 'Events', to: '/events' },
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
    nav: [{ label: 'Callouts', to: '/vendors/callouts' }],
  },
  venues: {
    id: 'venues',
    name: 'Event OS for Venues',
    tagline: 'Fill your venue with events',
    home: '/venues',
    nav: [],
  },
}
