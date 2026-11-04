import { queryOptions } from '@tanstack/react-query'
import { apiGet } from '#/lib/api'
import { MOCKS_ENABLED } from '#/lib/mocks'
import {
  normaliseOrganizer,
  normalisePastEvent,
  normaliseReviewSummary,
} from './normalise'
import type { Organizer, PastEvent, ReviewSubject, ReviewSummary } from './types'

/**
 * Each query reads the proposed API. In dev, invented data stands in when the
 * endpoint is missing. In production a missing endpoint is an error and the
 * section that uses it is hidden.
 */

export const organizerQuery = (id: string) =>
  queryOptions({
    queryKey: ['organizer', id],
    queryFn: async (): Promise<Organizer> => {
      try {
        const o = normaliseOrganizer(await apiGet(`/api/v1/organizers/${id}`, { timeoutMs: 4000 }))
        if (!o) throw new Error('unusable organizer')
        return o
      } catch (err) {
        if (MOCKS_ENABLED) {
          const { mockOrganizer } = await import('#/features/mocks/discovery')
          const m = mockOrganizer(id)
          if (m) return m
        }
        throw err
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

export const trendingOrganizersQuery = queryOptions({
  queryKey: ['organizers', 'trending'],
  queryFn: async (): Promise<Array<Organizer>> => {
    try {
      const res = await apiGet<{ organizers?: Array<unknown> }>(
        '/api/v1/organizers/trending?limit=8',
        { timeoutMs: 4000 },
      )
      return (res.organizers ?? [])
        .map(normaliseOrganizer)
        .filter((o): o is Organizer => !!o)
    } catch (err) {
      if (MOCKS_ENABLED) {
        const { mockOrganizers } = await import('#/features/mocks/discovery')
        return mockOrganizers().slice(0, 6)
      }
      throw err
    }
  },
  staleTime: 5 * 60 * 1000,
  retry: false,
})

export const pastEventsQuery = (p: { organizerId?: string; limit?: number }) => {
  const limit = p.limit ?? 8
  return queryOptions({
    queryKey: ['events', 'past', p.organizerId ?? '', limit],
    queryFn: async (): Promise<Array<PastEvent>> => {
      const qs = new URLSearchParams({ limit: String(limit) })
      if (p.organizerId) qs.set('organizer_id', p.organizerId)
      try {
        const res = await apiGet<{ events?: Array<unknown> }>(
          `/api/v1/events/past?${qs.toString()}`,
          { timeoutMs: 4000 },
        )
        return (res.events ?? [])
          .map(normalisePastEvent)
          .filter((e): e is PastEvent => !!e)
      } catch (err) {
        if (MOCKS_ENABLED) {
          const { mockPastEvents } = await import('#/features/mocks/discovery')
          return mockPastEvents(p.organizerId).slice(0, limit)
        }
        throw err
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

export const reviewSummaryQuery = (s: ReviewSubject) =>
  queryOptions({
    queryKey: ['reviews', s.kind, s.id],
    queryFn: async (): Promise<ReviewSummary | null> => {
      try {
        const raw = await apiGet(
          `/api/v1/reviews?subject=${s.kind}&id=${encodeURIComponent(s.id)}`,
          { timeoutMs: 4000 },
        )
        return normaliseReviewSummary(raw)
      } catch (err) {
        if (MOCKS_ENABLED) {
          const { mockReviewSummary } = await import('#/features/mocks/discovery')
          return mockReviewSummary(s.id)
        }
        throw err
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
