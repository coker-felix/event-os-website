import type { Banner } from '#/features/banners/types'

/** Invented banners, used only when mocks are enabled and the API fails. */
export function mockBanners(nowSec = Math.floor(Date.now() / 1000)): Array<Banner> {
  return [
    {
      id: 'mock-event',
      type: 'event',
      title: 'Rooftop Sunset Sessions',
      subtitle: 'Live DJs and skyline views, this weekend.',
      ctaLabel: 'See event',
      href: '/events',
      eventStartsAt: nowSec + 2 * 86400 + 19 * 3600,
      eventTimezone: 'Africa/Lagos',
      accentColor: '#ff5a36',
    },
    {
      id: 'mock-editorial',
      type: 'editorial',
      title: 'Weekend picks',
      subtitle: 'Five things worth leaving the house for.',
      ctaLabel: 'Read more',
      href: '/blog',
    },
    {
      id: 'mock-platform',
      type: 'platform',
      title: 'Run a stall? Vendor callouts are open',
      subtitle: 'Get booked at events near you.',
      ctaLabel: 'See callouts',
      href: '/vendors/callouts',
      accentColor: '#1fa87a',
    },
  ]
}
