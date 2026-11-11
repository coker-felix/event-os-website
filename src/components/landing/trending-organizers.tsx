import { ArrowUpRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { OrganizerAvatar } from '#/components/organizers/organizer-avatar'
import { isOrganizerId } from '#/features/discovery/ids'
import type { Organizer } from '#/features/discovery/types'

const MAX = 6

/** Organizers with events on sale now. Hidden when the API has none. */
export function TrendingOrganizers({
  organizers,
}: {
  organizers: Array<Organizer>
}) {
  const shown = organizers.filter((o) => isOrganizerId(o.id)).slice(0, MAX)
  if (shown.length === 0) return null
  return (
    <section
      aria-label="Trending organizers"
      className="relative left-1/2 mt-20 w-screen -translate-x-1/2 border-y border-foreground/10 bg-[#eee8da] px-4 py-16 sm:px-6 lg:mt-24 lg:px-8 lg:py-24"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <header className="lg:col-span-4">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            Organizers
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Trending organizers
          </h2>
          <p className="mt-4 max-w-xs text-base leading-relaxed text-mist">
            Follow the people behind the nights you like.
          </p>
        </header>
        <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
          {shown.map((o) => (
            <li key={o.id}>
              <Link
                to="/organizers/$organizerId"
                params={{ organizerId: o.id }}
                className="group flex min-h-[5.5rem] items-center gap-4 rounded-2xl border border-foreground/10 bg-card p-4 transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                <OrganizerAvatar name={o.name} logoUrl={o.logoUrl} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{o.name}</span>
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
                <ArrowUpRight
                  className="size-4 shrink-0 text-primary opacity-0 transition group-hover:opacity-100"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
