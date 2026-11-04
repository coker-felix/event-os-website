/**
 * Copy for the vendors landing page. It promises only what the platform does
 * today; anything else lives in COMING_SOON or a scenario's `soon` field and
 * is always shown with a "Coming soon" tag. src/content/vendor-copy.test.ts
 * fails if this file drifts from that rule.
 */

export const HERO = {
  eyebrow: 'For vendors',
  headline: 'Get booked at events near you',
  subline:
    'Organizers post what they need. You apply, get selected, and keep one calendar of every gig.',
}

export interface Scenario {
  id: 'solo' | 'caterer' | 'production'
  who: string
  /** The frustration, in the vendor's own words. */
  situation: string
  /** What exists today. */
  today: string
  /** A related feature that is not live yet. The page tags it "Coming soon". */
  soon?: string
}

export const SCENARIOS: Array<Scenario> = [
  {
    id: 'solo',
    who: 'Solo operator',
    situation: 'Two clients asked for the same Saturday.',
    today:
      'One calendar blocks the dates you have accepted, so you cannot double-book. A verified badge, set by an admin, helps new clients trust you.',
  },
  {
    id: 'caterer',
    who: 'Caterer',
    situation: 'Every job comes with a different set of promises.',
    today:
      'Each accepted booking gets a contract and a draft invoice that state what was agreed.',
    soon: 'Headcount lock',
  },
  {
    id: 'production',
    who: 'Production house',
    situation: 'You spend hours pitching to people who do not know your work.',
    today:
      'A public page shows your services to organizers who have never worked with you.',
    soon: 'Request-for-proposal tools and payment protection',
  },
]

export interface Benefit {
  id: 'calendar' | 'contract' | 'verified' | 'start'
  title: string
  body: string
}

export const BENEFITS: Array<Benefit> = [
  {
    id: 'calendar',
    title: 'One calendar',
    body: 'Accepted bookings block those dates, so double-booking is closed off.',
  },
  {
    id: 'contract',
    title: 'A contract and invoice for every booking',
    body: 'Each accepted booking produces a contract and a draft invoice. Completed bookings can be rated once.',
  },
  {
    id: 'verified',
    title: 'A verified badge',
    body: 'An admin can mark you Verified or Partnered. It shows on your public page and in the directory.',
  },
  {
    id: 'start',
    title: 'Start without KYC',
    body: 'You can apply to a callout and be selected before KYC. Your payout is held until KYC clears.',
  },
]

export interface SoonItem {
  id: 'protection' | 'headcount' | 'rfp'
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
    id: 'headcount',
    title: 'Headcount lock',
    body: 'Lock the guest count ahead of the event and send you one final number.',
  },
  {
    id: 'rfp',
    title: 'Request-for-proposal tools',
    body: 'Organizers post a brief and you bid, so you only pitch for serious work.',
  },
]

export interface Step {
  title: string
  body: string
}

// A real sequence, so the numbers carry meaning.
export const HOW_TO_START: Array<Step> = [
  { title: 'Create your profile', body: 'Add your services in the vendor portal. It takes a few minutes.' },
  { title: 'Apply to a callout', body: 'Pick an open callout that fits and apply.' },
  { title: 'Get selected', body: 'The organizer picks you, and the dates go on your calendar.' },
]
