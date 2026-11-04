import { queryOptions } from '@tanstack/react-query'
import { apiGet } from '#/lib/api'
import { MOCKS_ENABLED } from '#/lib/mocks'
import type { EventCategory, PublicEvent } from './types'

export const eventsQuery = queryOptions({
  queryKey: ['events', 'public', { limit: 60 }],
  queryFn: async () => {
    const res = await apiGet<{ events?: Array<PublicEvent>; total?: number }>(
      '/api/v1/events?limit=60&offset=0',
    )
    const events = res.events ?? []
    // Dev only: fill price, venue, city and availability the API lacks.
    if (MOCKS_ENABLED) {
      const { withEventExtras } = await import('./enrich')
      return events.map((e) => withEventExtras(e))
    }
    return events
  },
  staleTime: 60 * 1000,
  retry: 1,
})

export const categoriesQuery = queryOptions({
  queryKey: ['event-categories'],
  queryFn: async () => {
    const res = await apiGet<{ categories?: Array<EventCategory> }>(
      '/api/v1/event-categories?limit=100&offset=0',
    )
    return res.categories ?? []
  },
  staleTime: 10 * 60 * 1000,
})
