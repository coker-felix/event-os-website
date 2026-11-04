import type { Banner } from './types'

/** Shown while banners load, when the API is slow or down, or when empty. */
export const DEFAULT_BANNER: Banner = {
  id: 'default',
  type: 'platform',
  title: "See what's on near you",
  subtitle: 'Browse upcoming events and get your tickets in a few taps.',
  ctaLabel: 'Browse all events',
  href: '/events',
}
