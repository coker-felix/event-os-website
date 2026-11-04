import { Link } from '@tanstack/react-router'
import { OrganizerAvatar } from '#/components/organizers/organizer-avatar'
import { isOrganizerId } from '#/features/discovery/ids'
import type { Organizer } from '#/features/discovery/types'

const MAX = 6

/** Organizers with events on sale now. Hidden when the API has none. */
export function TrendingOrganizers({ organizers }: { organizers: Array<Organizer> }) {
  const shown = organizers.filter((o) => isOrganizerId(o.id)).slice(0, MAX)
  if (shown.length === 0) return null
  return (
    <section aria-label="Trending organizers" className="mt-12">
      <h2 className="text-2xl font-bold">Trending organizers</h2>
      <p className="mt-1 text-sm text-mist">Follow the people behind the nights you like.</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((o) => (
          <li key={o.id}>
            <Link
              to="/organizers/$organizerId"
              params={{ organizerId: o.id }}
              className="flex items-center gap-4 rounded-2xl border border-line bg-card p-4 transition-colors hover:border-foreground"
            >
              <OrganizerAvatar name={o.name} logoUrl={o.logoUrl} />
              <span className="min-w-0">
                <span className="block truncate font-bold">{o.name}</span>
                <span className="block truncate text-sm text-mist">
                  {[
                    o.city,
                    o.upcomingCount
                      ? `${o.upcomingCount} ${o.upcomingCount === 1 ? 'event' : 'events'} on sale`
                      : undefined,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
