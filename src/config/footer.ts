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
      { label: 'For organizers', to: '/organizers' },
      { label: 'Create an event', portal: '/register' },
      { label: 'Organizer sign in', portal: '/login' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      // Shown only when there is a team or open roles to list.
      { label: 'Our team', to: '/about/team', when: 'team' },
      { label: 'Careers', to: '/careers', when: 'careers' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'Ticket self help', to: '/tickets/help' },
      { label: 'FAQs', to: '/', hash: 'faqs' },
    ],
  },
  { heading: 'Legal', links: LEGAL_LINKS },
] as const
