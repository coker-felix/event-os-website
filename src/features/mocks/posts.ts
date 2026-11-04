import type { BlogPost } from '#/features/blog/types'

/** Invented posts, used only when mocks are enabled and the API fails. */
export function mockPosts(nowSec = Math.floor(Date.now() / 1000)): Array<BlogPost> {
  const day = 86400
  return [
    {
      id: 'mock-1',
      slug: 'first-timers-guide-to-buying-tickets',
      title: "A first-timer's guide to buying tickets",
      excerpt: 'Everything to check before you hit pay, from dates to door times.',
      category: 'Guides',
      publishedAt: nowSec - 3 * day,
      readMinutes: 4,
    },
    {
      id: 'mock-2',
      slug: 'how-vendors-win-more-bookings',
      title: 'How vendors win more bookings',
      excerpt: 'Small profile changes that get you noticed by organizers.',
      category: 'Vendors',
      publishedAt: nowSec - 9 * day,
      readMinutes: 6,
    },
    {
      id: 'mock-3',
      slug: 'venue-owners-hosting-checklist',
      title: "The venue owner's hosting checklist",
      excerpt: 'What to settle before you say yes to an event.',
      category: 'Venues',
      publishedAt: nowSec - 20 * day,
      readMinutes: 5,
    },
  ]
}
