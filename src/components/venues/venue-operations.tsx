import { Link } from '@tanstack/react-router'
import { VENUE_OPERATIONS } from '#/content/venue-landing'
import { CTA } from '#/lib/cta'

export function VenueOperations() {
  return (
    <section aria-labelledby="venue-operations-title" className="mt-20">
      <div className="grid gap-6 border-b border-line pb-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
            Venue operations
          </p>
          <h2
            id="venue-operations-title"
            className="mt-2 max-w-xl text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
          >
            Your venue workspace works with or without a public listing.
          </h2>
        </div>
        <div>
          <p className="max-w-2xl text-base leading-relaxed text-mist">
            Run venue activity in EventRail even when a booking starts on
            another platform, comes through an AI tool, or is for an internal
            event.
          </p>
          <p className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-foreground">
            Public directory listing is optional
          </p>
        </div>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {VENUE_OPERATIONS.map((item) => (
          <li
            key={item.id}
            className="lift-card rounded-3xl border border-line bg-card p-6 sm:p-7"
          >
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              {item.body}
            </p>
            {item.id === 'organizer-tools' && (
              <Link to="/organizers" className={`${CTA.ghost} mt-3`}>
                Explore organizer tools
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
