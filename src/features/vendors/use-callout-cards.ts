import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { eventsQuery } from '#/features/events/queries'
import { MOCKS_ENABLED } from '#/lib/mocks'
import { joinCalloutsWithEvents } from './callouts'
import { mockCallouts } from './mocks'
import { calloutsQuery } from './queries'
import type { CalloutCard } from './types'

/**
 * Open callouts joined to their events. A callout with no known event still
 * comes back, without event details. In development, when the API has no open
 * callouts, invented ones stand in so the pages can be seen.
 */
export function useCalloutCards(p: { category?: string; page: number }): {
  cards: Array<CalloutCard>
  isPending: boolean
  isError: boolean
  hasMore: boolean
  refetch: () => void
} {
  const callouts = useQuery(calloutsQuery(p))
  const events = useQuery(eventsQuery)

  const cards = useMemo(() => {
    const eventList = events.data ?? []
    let list = callouts.data?.callouts ?? []
    if (MOCKS_ENABLED && callouts.isSuccess && list.length === 0) {
      list = mockCallouts(eventList.map((e) => e.id)).filter(
        (c) => !p.category || c.category === p.category,
      )
    }
    return joinCalloutsWithEvents(list, eventList)
  }, [callouts.data, callouts.isSuccess, events.data, p.category])

  return {
    cards,
    isPending: callouts.isPending,
    isError: callouts.isError,
    hasMore: callouts.data?.hasMore ?? false,
    refetch: () => void callouts.refetch(),
  }
}
