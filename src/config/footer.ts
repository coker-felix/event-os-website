/** Footer navigation. Internal links are real routes; portal links leave the site. */
export const LEGAL_LINKS = [
  { label: 'Terms', to: '/terms' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Cookies', to: '/cookies' },
  { label: 'Cookie settings', action: 'cookie-settings' },
] as const

export const FOOTER_COLUMNS = [
  {
    heading: 'Explore',
    links: [
      { label: 'All events', to: '/events' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  {
    heading: 'Vendors',
    links: [
      { label: 'For vendors', to: '/vendors' },
      { label: 'Vendor callouts', to: '/vendors/callouts' },
      { label: 'Vendor directory', to: '/vendors/directory' },
    ],
  },
  {
    heading: 'Venues',
    links: [
      { label: 'For venues', to: '/venues' },
      { label: 'Venue directory', to: '/venues/directory' },
    ],
  },
  {
    heading: 'Organizers',
    links: [
      { label: 'How it works', to: '/', hash: 'organizers' },
      { label: 'Create an event', portal: '/register' },
      { label: 'Organizer sign in', portal: '/login' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'Ticket self help', to: '/tickets/help' },
      { label: 'Contact us', to: '/contact' },
      { label: 'FAQs', to: '/', hash: 'faqs' },
    ],
  },
  { heading: 'Legal', links: LEGAL_LINKS },
] as const
