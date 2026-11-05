import type { Job, TeamMember } from '#/features/company/visible'

/** Facts the site cannot know. Add them and they appear on the About page; until then they are hidden. */
export const COMPANY: {
  founded?: number
  location?: string
  /** A public contact address, shown on the Careers page when there are no open roles. */
  email?: string
} = {}

/**
 * Drafted from what the product does. Edit freely; the copy test refuses
 * superlatives and claims the site cannot back up.
 */
export const ABOUT = {
  eyebrow: 'About EventRail',
  headline: 'Events run on people.',
  headlineContinuation: 'EventRail connects the work.',
  intro:
    'EventRail brings event discovery, ticketing and operations into one system—from the first ticket sale to the work of opening the doors.',
  why: [
    'Event work gets split across ticketing, venue bookings, vendors and promotion. EventRail brings those jobs into one system so organizers can see the pieces around an event together.',
    'Attendees can discover events and buy tickets. Vendors and venues have routes to get found and booked. Organizers can manage the work before event day.',
  ],
  channels: [
    'Web',
    'USSD',
    'WhatsApp',
    'Telegram',
    'API',
    'Mobile',
    'White-label portals',
  ],
  journey: [
    {
      stage: 'Discover',
      body: 'Attendees find an event and choose a ticket.',
    },
    {
      stage: 'Coordinate',
      body: 'Organizers bring tickets, venues and vendors into the plan.',
    },
    {
      stage: 'Reach',
      body: 'Share the event through the channels your audience already uses.',
    },
    {
      stage: 'Welcome',
      body: 'Bring the ticket and the event day together at the door.',
    },
  ],
  principles: [
    {
      title: 'One event, shared context',
      body: 'Ticketing, venue work and vendor coordination belong to the same event, not separate tabs and spreadsheets.',
    },
    {
      title: 'Reach people where they are',
      body: 'Web, mobile, USSD, messaging, API and white-label portals give events more than one way to reach people.',
    },
    {
      title: 'Make every handoff clearer',
      body: 'The people planning, promoting and attending an event need useful information at the moment they need it.',
    },
  ],
  products: [
    {
      name: 'For attendees',
      body: 'Find events, see what past ones were like, and buy tickets.',
      to: '/events',
    },
    {
      name: 'For vendors',
      body: 'Get booked at events, with callouts that match what you offer.',
      to: '/vendors',
    },
    {
      name: 'For venues',
      body: 'Get your venue seen and manage booking requests in one place.',
      to: '/venues',
    },
    {
      name: 'For organizers',
      body: 'Sell tickets, book venues and vendors, and promote your event from one dashboard.',
      to: '/organizers',
    },
  ] as const,
}

/**
 * The people behind EventRail. Add real team members here; the Team page and
 * its footer link appear when there is at least one. Only list people who have
 * agreed to be shown.
 *
 *   { name: 'Ama Mensah', role: 'Co-founder', bio: 'One or two sentences.', photo: '/team/ama.jpg', link: 'https://www.linkedin.com/in/…' },
 */
export const TEAM: Array<TeamMember> = [
  { name: 'Felix Coker', role: 'Co-founder' },
  { name: 'Bright Dzotor', role: 'Co-founder' },
]

/**
 * Open roles. The Careers page and its footer link appear when there is at
 * least one. `apply` is an https link or a mailto: address.
 *
 *   { title: 'Product designer', team: 'Product', location: 'Accra', type: 'Full time', apply: 'mailto:jobs@example.com' },
 */
export const JOBS: Array<Job> = []
