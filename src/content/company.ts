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
  eyebrow: 'About Event OS',
  headline: 'Everything events run on, in one place',
  intro:
    'Event OS helps people find events worth going to, and helps the people who run them.',
  why: [
    'Running an event means juggling tickets, venues, vendors and promotion across separate tools. We put them in one place, so organizers spend less time coordinating and more time on the night.',
    'Vendors and venues are verified before they are paid, and every ticket can be checked at the gate. People who just want something to do this weekend get one place to look.',
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
 * The people behind Event OS. Add real team members here; the Team page and
 * its footer link appear when there is at least one. Only list people who have
 * agreed to be shown.
 *
 *   { name: 'Ama Mensah', role: 'Co-founder', bio: 'One or two sentences.', photo: '/team/ama.jpg', link: 'https://www.linkedin.com/in/…' },
 */
export const TEAM: Array<TeamMember> = []

/**
 * Open roles. The Careers page and its footer link appear when there is at
 * least one. `apply` is an https link or a mailto: address.
 *
 *   { title: 'Product designer', team: 'Product', location: 'Accra', type: 'Full time', apply: 'mailto:jobs@example.com' },
 */
export const JOBS: Array<Job> = []
