/**
 * Copy for the "For organizers" section on the attendee landing page. The
 * owner chose to state every feature here as available. The backend work that
 * makes each claim true is in event-os-backend/docs/specs/organizer-platform.md,
 * which lists every claim against its status.
 */
export const HERO = {
  eyebrow: 'For event organizers',
  headline: 'Run your entire event from one dashboard',
  subline:
    'Sell tickets, book vendors and venues, promote your event and manage your guests, all in one place.',
  cta: 'Create your event',
}

export interface Pillar {
  id: 'sell' | 'book' | 'manage' | 'promote'
  title: string
  body: string
}

export const PILLARS: Array<Pillar> = [
  {
    id: 'sell',
    title: 'Sell and scan',
    body: 'Beautiful event pages, card and mobile money payments, and QR check-in at the gate that keeps working offline.',
  },
  {
    id: 'book',
    title: 'Book and coordinate',
    body: 'Request a venue and book vendors from your event dashboard. Vendors and venues are verified before they are paid.',
  },
  {
    id: 'manage',
    title: 'Manage and budget',
    body: 'Track ticket sales, vendor invoices and your budget, and keep your guest list in one place.',
  },
  {
    id: 'promote',
    title: 'Promote and advertise',
    body: 'A branded event page, featured placement on the Event OS homepage and in discovery, and alerts to people who follow your city and category.',
  },
]

export interface Persona {
  id: 'promoters' | 'corporate' | 'community'
  label: string
  headline: string
  points: Array<string>
}

export const PERSONAS: Array<Persona> = [
  {
    id: 'promoters',
    label: 'Promoters and clubs',
    headline: 'Fill the room and know who sent them',
    points: [
      'Sell tickets and manage guest lists, including complimentary guests.',
      'Give each promoter their own link and track the sales they bring in.',
      'Track promoter commissions without a spreadsheet.',
      'Promote the night with featured placement and alerts to people in your city.',
    ],
  },
  {
    id: 'corporate',
    label: 'Corporate planners',
    headline: 'Keep the budget and the suppliers in order',
    points: [
      'Manage your budget against what you have booked and invoiced.',
      'Request venues and book vendors from the same dashboard.',
      'Track vendor compliance: verification and contracts, at a glance.',
      'Promote the event with a branded page and targeted alerts.',
    ],
  },
  {
    id: 'community',
    label: 'Community and free events',
    headline: 'Keep it simple, keep it free',
    points: [
      'Free RSVPs, with going, maybe and can’t go.',
      'Invite-only events and invite management.',
      'Simple gate scanning with a phone, even without signal.',
      'Spread the word with a branded event page and alerts to local followers.',
    ],
  },
]

export const CLOSING = {
  heading: 'Ready to build your next event?',
  body: 'Create your event and see the dashboard for yourself.',
  cta: 'Create your event',
}
