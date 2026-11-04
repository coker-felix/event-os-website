/**
 * Copy for the venues landing page. It promises only what the platform does
 * today; anything else lives in COMING_SOON and is always shown with a
 * "Coming soon" tag. It never tells a visitor they can claim a listing (that
 * flow is behind a flag that is off). src/content/venue-copy.test.ts fails if
 * this file drifts from those rules.
 */

export const HERO = {
  eyebrow: 'For venues',
  headline: 'Get your venue seen, and every booking in one place',
  subline:
    'List your venue so organizers can find it, see which dates are taken, and send booking requests.',
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
  { title: 'Create your profile', body: "Add your venue's details in the portal. It takes a few minutes." },
  { title: 'Get reviewed', body: 'We check your details before your venue goes live in the directory.' },
  { title: 'Receive booking requests', body: 'Organizers send requests for dates. You accept or decline.' },
]
