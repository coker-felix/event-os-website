/**
 * Copy for the venues landing page. Upcoming features stay in COMING_SOON;
 * venue operations, integrations and internal events are available without a
 * public listing. src/content/venue-copy.test.ts checks this copy for accuracy.
 */

export const HERO = {
  eyebrow: 'For venues',
  headline: 'Run your venue, beyond online bookings',
  subline:
    'Manage EventRail and external bookings, internal events and seat charts from one venue portal. A public listing is optional.',
}

export interface Audience {
  id: 'owner' | 'organizer'
  who: string
  /** The frustration, in their own words. */
  situation: string
  /** What exists today. */
  today: string
}

export const AUDIENCES: Array<Audience> = [
  {
    id: 'owner',
    who: 'Venue owners',
    situation: 'Two organizers asked about the same weekend.',
    today:
      'A calendar blocks the dates you accept, so a second booking for the same dates cannot be accepted. Each accepted booking gets a contract and a draft invoice.',
  },
  {
    id: 'organizer',
    who: 'Organizers',
    situation:
      'You need a venue that fits your guest count, and you do not know which dates are free.',
    today:
      'The directory lists venues by place and size, marks which ones are bookable, and shows the dates a venue already holds.',
  },
]

export interface VenueOperation {
  id: 'integrations' | 'private-events' | 'seat-charts' | 'organizer-tools'
  title: string
  body: string
}

export const VENUE_OPERATIONS: Array<VenueOperation> = [
  {
    id: 'integrations',
    title: 'Bring bookings in from other tools',
    body: 'Connect other booking platforms and AI tools through API integrations, so your venue team can manage activity in one place.',
  },
  {
    id: 'private-events',
    title: 'Manage internal and private events',
    body: 'Keep staff events, private functions and venue activity in your workspace without publishing them to the public directory.',
  },
  {
    id: 'seat-charts',
    title: 'Map rooms and seats',
    body: 'Build venue maps and seating charts to plan sections, room layouts and guest placement.',
  },
  {
    id: 'organizer-tools',
    title: 'Organize events from your venue account',
    body: 'A venue organization can also create and manage its own events with EventRail organizer capabilities.',
  },
]

export interface Benefit {
  id: 'profile' | 'calendar' | 'contract' | 'insights'
  title: string
  body: string
}

export const BENEFITS: Array<Benefit> = [
  {
    id: 'profile',
    title: 'A public profile',
    body: 'Once reviewed, your venue is listed in the directory with its address, capacity and amenities.',
  },
  {
    id: 'calendar',
    title: 'A calendar that cannot double-book',
    body: 'Accepted bookings block those dates. Held dates show publicly as ranges only, with no personal details.',
  },
  {
    id: 'contract',
    title: 'A contract and invoice for every booking',
    body: "Each accepted booking produces a contract and a draft invoice. The organizer's confirmation completes it, and completed bookings can be rated once.",
  },
  {
    id: 'insights',
    title: 'See how your space is used',
    body: 'Utilization analytics show how often your venue is booked.',
  },
]

export interface SoonItem {
  id: 'protection' | 'addons' | 'rfp'
  title: string
  body: string
}

/** Not live yet. Shown only in the "Coming soon" box. */
export const COMING_SOON: Array<SoonItem> = [
  {
    id: 'protection',
    title: 'Payment protection',
    body: 'A way for organizers to set money aside before the event.',
  },
  {
    id: 'addons',
    title: 'Add-on rentals',
    body: 'Offer chairs, tables and other extras with a booking.',
  },
  {
    id: 'rfp',
    title: 'Request-for-proposal tools',
    body: 'Organizers post a brief and venues respond, so you only quote for serious events.',
  },
]

export interface Step {
  title: string
  body: string
}

// A real sequence, so the numbers carry meaning.
export const HOW_TO_START: Array<Step> = [
  { title: 'Set up your venue workspace', body: 'Start managing venue operations in EventRail. A public directory listing is optional.' },
  { title: 'Connect your booking sources', body: 'Use EventRail booking requests or connect other platforms and AI tools through APIs.' },
  { title: 'Manage spaces and events', body: 'Plan seat charts, run private events and organize your own public events from the same organization.' },
]
