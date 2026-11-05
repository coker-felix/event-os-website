import type { BlogArticle, BlogPost } from '#/features/blog/types'

/** Invented posts, used only when mocks are enabled and the API fails. */
export function mockPosts(nowSec = Math.floor(Date.now() / 1000)): Array<BlogPost> {
  const day = 86400
  const post = (
    n: number,
    slug: string,
    title: string,
    excerpt: string,
    category: string,
    daysAgo: number,
    readMinutes: number,
  ): BlogPost => ({
    id: `mock-${n}`,
    slug,
    title,
    excerpt,
    category,
    author: 'EventRail team',
    publishedAt: nowSec - daysAgo * day,
    readMinutes,
  })
  return [
    post(1, 'first-timers-guide-to-buying-tickets', "A first-timer's guide to buying tickets", 'Everything to check before you hit pay, from dates to door times.', 'Guides', 3, 4),
    post(2, 'how-vendors-win-more-bookings', 'How vendors win more bookings', 'Small profile changes that get you noticed by organizers.', 'Vendors', 9, 6),
    post(3, 'venue-owners-hosting-checklist', "The venue owner's hosting checklist", 'What to settle before you say yes to an event.', 'Venues', 20, 5),
    post(4, 'what-to-bring-to-an-outdoor-event', 'What to bring to an outdoor event', 'A short list that saves a long walk back to the car.', 'Guides', 26, 3),
    post(5, 'pricing-your-stall-at-a-festival', 'Pricing your stall at a festival', 'How to price for a crowd that is there to browse, not shop.', 'Vendors', 33, 7),
    post(6, 'making-your-venue-easy-to-find', 'Making your venue easy to find', 'Photos, directions and details organizers look for first.', 'Venues', 41, 4),
    post(7, 'what-is-new-this-month', "What's new on EventRail this month", 'Filters, saved events and a faster checkout.', 'News', 48, 2),
    post(8, 'getting-your-money-back-when-plans-change', 'When plans change: refunds and transfers', 'How refunds work and who to ask.', 'Guides', 55, 5),
    post(9, 'a-year-of-events-in-numbers', 'A year of events, in numbers', 'What people went to, and when they booked.', 'News', 62, 6),
  ]
}

const BODY = [
  'Plans change, tickets sell out, and doors open earlier than anyone expects. A little preparation makes the day easier.',
  'Start with the basics: the date, the time zone, and where the entrance is. Check the event page for each of them before you leave.',
  'Then think about how you are getting there and back. Late events are easier when your trip home is already sorted.',
  'Finally, keep your ticket handy. If you lose access, ticket self help can find it again using the phone number or email you booked with.',
].join('\n\n')

/** Invented full article for a slug, in dev only. Null for an unknown slug. */
export function mockArticle(
  slug: string,
  nowSec = Math.floor(Date.now() / 1000),
): BlogArticle | null {
  const found = mockPosts(nowSec).find((p) => p.slug === slug)
  return found ? { ...found, body: BODY } : null
}
