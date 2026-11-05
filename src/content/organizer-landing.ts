import type { Faq } from './faqs'

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
    body: 'A branded event page, featured placement on the EventRail homepage and in discovery, and alerts to people who follow your city and category.',
  },
]

export interface Persona {
  id: 'weddings' | 'corporate' | 'promoters' | 'community'
  label: string
  headline: string
  points: Array<string>
}

export const PERSONAS: Array<Persona> = [
  {
    id: 'weddings',
    label: 'Weddings',
    headline: 'Bring every detail of the day together',
    points: [
      'Keep guest lists and RSVPs together for the ceremony and reception.',
      'Coordinate your venue and vendors from one dashboard.',
      'Share one event page with guests for the details they need.',
      'Check guests in at the door with a phone, even without signal.',
    ],
  },
  {
    id: 'corporate',
    label: 'Corporate Planners',
    headline: 'Keep the budget and the suppliers in order',
    points: [
      'Manage your budget against what you have booked and invoiced.',
      'Request venues and book vendors from the same dashboard.',
      'Track vendor compliance: verification and contracts, at a glance.',
      'Promote the event with a branded page and targeted alerts.',
    ],
  },
  {
    id: 'promoters',
    label: 'Promoters & Clubs',
    headline: 'Fill the room and know who sent them',
    points: [
      'Sell tickets and manage guest lists, including complimentary guests.',
      'Give each promoter their own link and track the sales they bring in.',
      'Track promoter commissions without a spreadsheet.',
      'Promote the night with featured placement and alerts to people in your city.',
    ],
  },
  {
    id: 'community',
    label: 'Community and Free Events',
    headline: 'Keep it simple, keep it free',
    points: [
      'Free RSVPs, with going, maybe and can’t go.',
      'Invite-only events and invite management.',
      'Simple gate scanning with a phone, even without signal.',
      'Spread the word with a branded event page and alerts to local followers.',
    ],
  },
]

interface Step {
  title: string
  body: string
}

export const HOW_TO_START: Array<Step> = [
  { title: 'Create your event', body: 'Add the details, set up your tickets, and publish when you are ready.' },
  { title: 'Book what you need', body: 'Request a venue and book vendors from your event dashboard.' },
  { title: 'Promote and sell', body: 'Share your page, give promoters their links, and scan tickets at the gate.' },
]

export const ORGANIZER_FAQS: Array<Faq> = [
  {
    question: 'How do I create an event?',
    answer: "Create your event in the portal: add the details, set up your tickets, and publish when you're ready.",
  },
  {
    question: 'What can my buyers pay with?',
    answer: 'Cards and mobile money, on a secure payment page.',
  },
  {
    question: 'Can I run a free event?',
    answer: 'Yes. Offer free RSVPs with going, maybe and can\u2019t go, or make the event invite-only.',
  },
  {
    question: 'How do I get paid?',
    answer: 'Ticket sales are held and released to you after the event.',
  },
  {
    question: 'Can I book a venue and vendors from my dashboard?',
    answer: 'Yes. Send a booking request to a venue and book vendors or open a callout, all from your event. Vendors and venues are verified before they are paid.',
  },
  {
    question: 'How does check-in work at the gate?',
    answer: 'Every ticket has a QR code. Scan it with a phone, even without signal. Entries sync when you are back online, and a ticket can only enter once.',
  },
  {
    question: 'Can promoters sell tickets for me?',
    answer: 'Yes. Give each promoter their own link and see the tickets they sell and the commission they have earned. You can also keep a guest list, including complimentary guests.',
  },
  {
    question: 'Can you help me promote my event?',
    answer: 'Yes. Your event gets a branded page, and you can request featured placement on the EventRail homepage and send alerts to people who follow your city and category.',
  },
]

/** The slim band on the attendee landing page that leads to the organizers page. */
export const TEASER = {
  eyebrow: 'Hosting an event?',
  heading: 'Run your entire event from one dashboard',
  body: 'Sell tickets, book vendors and venues, and promote your event, all in one place.',
  cta: 'Explore EventRail for organizers',
}

export const CLOSING = {
  heading: 'Ready to build your next event?',
  body: 'Create your event and see the dashboard for yourself.',
  cta: 'Create your event',
}
