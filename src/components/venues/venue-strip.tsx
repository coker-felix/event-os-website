import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { portalUrl } from '#/features/vendors/portal'
import { venueDirectoryQuery } from '#/features/venues/queries'
import { sortVenues } from '#/features/venues/venues'
import { VenueCard } from './venue-card'
import { CTA } from '#/lib/cta'

const SHOWN = 3

/**
 * "Listed now": a taste of the directory straight under the hero. With no
 * venues it says so honestly and points at listing yours.
 */
export function VenueStrip() {
  const { data, isPending, isError } = useQuery(
    venueDirectoryQuery({ page: 1 }),
  )
  const venues = useMemo(() => sortVenues(data?.venues ?? []), [data])
  const count = `${venues.length}${data?.hasMore ? '+' : ''}`

  return (
    <section aria-label="Listed now" className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
            Find your space
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {venues.length > 0
              ? `Listed now: ${count} ${venues.length === 1 && !data?.hasMore ? 'venue' : 'venues'}`
              : 'Listed now'}
          </h2>
        </div>
        {venues.length > 0 && (
          <Link
            to="/venues/directory"
            className="text-sm font-semibold text-violet-ink underline decoration-violet-ink/30 underline-offset-4 hover:decoration-current"
          >
            See the directory
          </Link>
        )}
      </div>

      {isPending ? (
        <p className="mt-4 text-mist" role="status">
          Loading venues…
        </p>
      ) : isError ? (
        <p className="mt-4 text-mist" role="status">
          We couldn't load venues just now.{' '}
          <Link
            to="/venues/directory"
            className="font-semibold text-violet-ink hover:underline"
          >
            Try the directory
          </Link>
          .
        </p>
      ) : venues.length === 0 ? (
        <div className="mt-5 rounded-3xl border border-line bg-card p-6 sm:p-7">
          <p className="text-lg font-semibold">No venues listed yet.</p>
          <p className="mt-1 text-mist">List yours and be one of the first.</p>
          <a href={portalUrl('/register')} className={`${CTA.primary} mt-4`}>
            List your venue
          </a>
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {venues.slice(0, SHOWN).map((v) => (
            <li key={v.id}>
              <VenueCard venue={v} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
