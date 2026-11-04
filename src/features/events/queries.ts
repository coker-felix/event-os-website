import { queryOptions } from '@tanstack/react-query'
import { apiGet } from '#/lib/api'
import { withEventExtras } from './enrich'
import type { EventCategory, PublicEvent } from './types'

export const eventsQuery = queryOptions({
  queryKey: ['events', 'public', { limit: 60 }],
  queryFn: async () => {
    const res = await apiGet<{ events?: Array<PublicEvent>; total?: number }>(
      '/api/v1/events?limit=60&offset=0',
    )
    return (res.events ?? []).map((e) => withEventExtras(e))
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
