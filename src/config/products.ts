export type ProductId = 'attendees' | 'vendors' | 'venues' | 'organizers'

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
    name: 'EventRail',
    tagline: 'Find events and get tickets',
    home: '/',
    nav: [
      { label: 'Events', to: '/events' },
      { label: 'Host an event', to: '/organizers' },
      { label: 'Blog', to: '/blog' },
      { label: 'Ticket help', to: '/tickets/help' },
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  organizers: {
    id: 'organizers',
    name: 'EventRail',
    tagline: 'Run your entire event from one dashboard',
    home: '/organizers',
    nav: [
      { label: 'Features', to: '/organizers', hash: 'features' },
      { label: 'Who it is for', to: '/organizers', hash: 'who' },
      { label: 'How to start', to: '/organizers', hash: 'start' },
      { label: 'FAQs', to: '/organizers', hash: 'faqs' },
    ],
    actions: [
      { label: 'Sign in', path: '/login', variant: 'secondary' },
      { label: 'Create your event', path: '/register', variant: 'primary' },
    ],
  },
  vendors: {
    id: 'vendors',
    name: 'EventRail',
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
    name: 'EventRail',
    tagline: 'Run venue operations across every booking source',
    home: '/venues',
    nav: [{ label: 'Directory', to: '/venues/directory' }],
    actions: [
      { label: 'Sign in', path: '/login', variant: 'secondary' },
      { label: 'List your venue', path: '/register', variant: 'primary' },
    ],
  },}
