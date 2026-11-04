import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { EventCard } from '#/components/landing/event-card'
import { byStart, isUpcoming } from '#/features/events/format'
import { categoriesQuery, eventsQuery } from '#/features/events/queries'

const COUNT = 3

/** The next few upcoming events. Renders nothing when there are none. */
export function HappeningSoon() {
  const events = useQuery(eventsQuery)
  const categories = useQuery(categoriesQuery)
  const names = useMemo(
    () => new Map((categories.data ?? []).map((c) => [c.id, c.name] as const)),
    [categories.data],
  )
  const next = useMemo(() => {
    const now = Date.now()
    return (events.data ?? [])
      .filter((e) => isUpcoming(e, now))
      .sort(byStart)
      .slice(0, COUNT)
  }, [events.data])

  if (next.length === 0) return null
  return (
    <section aria-label="Happening soon" className="mt-14">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-bold">Happening soon</h2>
        <Link
          to="/events"
          className="text-sm font-semibold text-violet-ink hover:underline"
        >
          See all events
        </Link>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {next.map((e) => (
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
