import { queryOptions } from '@tanstack/react-query'
import { apiGet } from '#/lib/api'
import { MOCKS_ENABLED } from '#/lib/mocks'
import { availabilityFromError } from './availability'
import {
  normaliseBlocks,
  normaliseVenueList,
  normaliseVenueProfile,
} from './normalise'
import type { VenueAvailability, VenueList, VenueProfile } from './types'

export const VENUES_PAGE_SIZE = 12
/** In development a thin directory is padded with invented venues up to this many. */
const MOCK_FILL = 6
const DAY = 86_400
/** How far ahead the venue page asks for held dates. */
const WINDOW_DAYS = 120

function limitFor(page: number): number {
  return VENUES_PAGE_SIZE * Math.max(1, page)
}

/** The public venue directory. `country` is a server filter; the rest is filtered in the browser. */
export const venueDirectoryQuery = (p: { country?: string; page: number }) => {
  const limit = limitFor(p.page)
  return queryOptions({
    queryKey: ['venues', 'directory', p.country ?? '', limit],
    queryFn: async (): Promise<VenueList> => {
      const qs = new URLSearchParams({ limit: String(limit), offset: '0' })
      if (p.country) qs.set('country', p.country)
      const raw = await apiGet<Record<string, unknown>>(
        `/api/v1/venues?${qs.toString()}`,
        { timeoutMs: 4000 },
      )
      const list = normaliseVenueList(raw, limit)
      // Dev only: pad a thin directory with invented venues that match the filter.
      if (MOCKS_ENABLED && list.venues.length < MOCK_FILL) {
        const { mockVenues } = await import('./mocks')
        const extra = mockVenues().filter((v) => !p.country || v.country === p.country)
        return { ...list, venues: [...list.venues, ...extra].slice(0, limit) }
      }
      return list
    },
    staleTime: 60 * 1000,
    retry: false,
  })
}

/** One venue's public page. A missing venue is an `ApiError` 404. */
export const venueQuery = (id: string) =>
  queryOptions({
    queryKey: ['venues', 'profile', id],
    queryFn: async (): Promise<VenueProfile> => {
      try {
        const raw = await apiGet<Record<string, unknown>>(
          `/api/v1/venues/${encodeURIComponent(id)}`,
          { timeoutMs: 4000 },
        )
        return normaliseVenueProfile(raw)
      } catch (err) {
        // Dev only: an invented venue from the padded directory.
        if (MOCKS_ENABLED) {
          const { mockVenueProfile } = await import('./mocks')
          const mock = mockVenueProfile(id)
          if (mock) return mock
        }
        throw err
      }
    },
    staleTime: 60 * 1000,
    retry: false,
  })

/**
 * Held date ranges for the next 120 days. An unclaimed or inactive venue
 * answers 409, which becomes `{ open: false }` rather than an error.
 */
export const venueAvailabilityQuery = (id: string, nowSec: number) =>
  queryOptions({
    // Keyed by the hour so the server and browser agree on the cache entry.
    queryKey: ['venues', 'availability', id, Math.floor(nowSec / 3600)],
    queryFn: async (): Promise<VenueAvailability> => {
      try {
        const qs = new URLSearchParams({
          fromAt: String(nowSec),
          toAt: String(nowSec + WINDOW_DAYS * DAY),
        })
        const raw = await apiGet<Record<string, unknown>>(
          `/api/v1/venues/${encodeURIComponent(id)}/availability?${qs.toString()}`,
          { timeoutMs: 4000 },
        )
        return { open: true, blocks: normaliseBlocks(raw) }
      } catch (err) {
        // Dev only: held dates for an invented venue.
        if (MOCKS_ENABLED) {
          const { mockVenueProfile, mockHeldBlocks } = await import('./mocks')
          const mock = mockVenueProfile(id)
          if (mock) {
            return { open: mock.claimed, blocks: mockHeldBlocks(id, nowSec) }
          }
        }
        return availabilityFromError(err)
      }
    },
    staleTime: 60 * 1000,
    retry: false,
  })
