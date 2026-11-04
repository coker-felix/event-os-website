import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { eventsQuery } from '#/features/events/queries'
import { joinCalloutsWithEvents, pointInventedAtEvents } from './callouts'
import { calloutsQuery } from './queries'
import type { CalloutCard } from './types'

/**
 * Open callouts joined to their events. A callout with no known event still
 * comes back, without event details.
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
    const list = pointInventedAtEvents(callouts.data?.callouts ?? [], eventList)
    return joinCalloutsWithEvents(list, eventList)
  }, [callouts.data, events.data])

  return {
    cards,
    isPending: callouts.isPending,
    isError: callouts.isError,
    hasMore: callouts.data?.hasMore ?? false,
    refetch: () => void callouts.refetch(),
  }
}
