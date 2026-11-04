import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { EventCard } from '#/components/landing/event-card'
import { isUpcoming } from '#/features/events/format'
import { categoriesQuery, eventsQuery } from '#/features/events/queries'
import type { PublicEvent } from '#/features/events/types'

const COUNT = 3

/** Up to three upcoming events in the same category or city. */
export function SimilarEvents({ current }: { current: PublicEvent }) {
  const events = useQuery(eventsQuery)
  const categories = useQuery(categoriesQuery)
  const names = useMemo(
    () => new Map((categories.data ?? []).map((c) => [c.id, c.name] as const)),
    [categories.data],
  )
  const similar = useMemo(() => {
    const now = Date.now()
    return (events.data ?? [])
      .filter(
        (e) =>
          e.id !== current.id &&
          isUpcoming(e, now) &&
          ((current.categoryId && e.categoryId === current.categoryId) ||
            (current.city && e.city === current.city)),
      )
      .slice(0, COUNT)
  }, [events.data, current])

  if (similar.length === 0) return null
  return (
    <section aria-label="More events like this" className="mt-12">
      <h2 className="text-2xl font-bold">More events like this</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {similar.map((e) => (
          <li key={e.id}>
            <EventCard
              event={e}
              categoryName={e.categoryId ? names.get(e.categoryId) : undefined}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
