import { Link } from '@tanstack/react-router'
import { EventCard } from './event-card'
import type { PublicEvent } from '#/features/events/types'

const MAX_PER_ROW = 4

export function EventRow({
  title,
  events,
  categoryNames,
}: {
  title: string
  events: Array<PublicEvent>
  categoryNames: Map<number, string>
}) {
  if (events.length === 0) return null
  return (
    <section aria-label={title} className="mt-12">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link
          to="/events"
          className="text-sm font-semibold text-violet-ink hover:underline"
        >
          See all events
        </Link>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {events.slice(0, MAX_PER_ROW).map((e) => (
          <li key={e.id}>
            <EventCard
              event={e}
              categoryName={
                e.categoryId ? categoryNames.get(e.categoryId) : undefined
              }
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
