import { PastEventCard } from '#/components/organizers/past-event-card'
import type { PastEvent } from '#/features/discovery/types'

const MAX = 4

/** Photos and replays from events that have happened. Hidden when the API has none. */
export function ReliveRow({ events }: { events: Array<PastEvent> }) {
  const shown = events.slice(0, MAX)
  if (shown.length === 0) return null
  return (
    <section aria-label="Relive it" className="mt-12">
      <h2 className="text-2xl font-bold">Relive it</h2>
      <p className="mt-1 text-sm text-mist">See what you missed, then catch the next one.</p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((e) => (
          <li key={e.id}>
            <PastEventCard event={e} />
          </li>
        ))}
      </ul>
    </section>
  )
}
