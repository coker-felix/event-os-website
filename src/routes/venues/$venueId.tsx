import { useMemo } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Globe, MapPin, Star, Users } from 'lucide-react'
import { BookableChip } from '#/components/venues/bookable-chip'
import { HeldDates } from '#/components/venues/held-dates'
import { serviceKindLabel } from '#/features/vendors/callouts'
import { portalUrl } from '#/features/vendors/portal'
import { isVenueId } from '#/features/venues/ids'
import { venueAvailabilityQuery, venueQuery } from '#/features/venues/queries'
import { safeSocialLinks } from '#/features/venues/venues'
import { ApiError } from '#/lib/api'
import { safeHttpUrl } from '#/lib/url'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/venues/$venueId')({
  // Warm the cache on the server. A malformed id or a missing venue is a real
  // 404; any other failure still renders, and the page shows a retry.
  loader: async ({ context: { queryClient }, params }) => {
    if (!isVenueId(params.venueId)) throw notFound()
    try {
      const v = await queryClient.ensureQueryData(venueQuery(params.venueId))
      if (v.claimed) {
        const nowSec = Math.floor(Date.now() / 1000)
        await Promise.allSettled([
          queryClient.ensureQueryData(venueAvailabilityQuery(params.venueId, nowSec)),
        ])
      }
      return {
        name: v.name,
        description:
          (v.description ?? '').slice(0, 160) ||
          [v.category && serviceKindLabel(v.category), v.city].filter(Boolean).join(' in '),
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound()
      return null
    }
  },
  notFoundComponent: VenueNotFound,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.name} | Event OS for Venues`
          : 'Venue | Event OS for Venues',
      },
      ...(loaderData
        ? [
            { name: 'description', content: loaderData.description },
            { property: 'og:title', content: loaderData.name },
            { property: 'og:description', content: loaderData.description },
          ]
        : []),
    ],
  }),
  component: VenuePage,
})

function VenueNotFound() {
  return (
    <div className="rounded-2xl border border-line bg-card p-6" role="alert">
      <h1 className="text-2xl font-bold">We can't find that venue</h1>
      <p className="mt-1 text-mist">
        It may have been removed or the link is wrong.
      </p>
      <Link
        to="/venues/directory"
        className={`${CTA.primary} mt-4`}
      >
        Back to the directory
      </Link>
    </div>
  )
}

function VenuePage() {
  const { venueId } = Route.useParams()
  const venue = useQuery(venueQuery(venueId))
  const nowSec = useMemo(() => Math.floor(Date.now() / 1000), [])
  // An unclaimed venue has no calendar, so the call is skipped for it.
  const availability = useQuery({
    ...venueAvailabilityQuery(venueId, nowSec),
    enabled: venue.data?.claimed === true,
  })

  if (venue.isPending) {
    return (
      <p className="text-mist" role="status">
        Loading venue…
      </p>
    )
  }
  if (venue.isError) {
    if (venue.error instanceof ApiError && venue.error.status === 404) {
      return <VenueNotFound />
    }
    return (
      <div className="rounded-2xl border border-line bg-card p-6" role="alert">
        <h1 className="text-2xl font-bold">We couldn't load this venue</h1>
        <p className="mt-1 text-mist">Check your connection, then try again.</p>
        <button
          type="button"
          onClick={() => void venue.refetch()}
          className={`${CTA.primary} mt-4`}
        >
          Try again
        </button>
      </div>
    )
  }

  const v = venue.data
  const website = safeHttpUrl(v.websiteUrl)
  const socials = safeSocialLinks(v.socialLinks)
  const place = [v.address, v.city, v.country].filter(Boolean).join(', ')

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/venues/directory"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Directory
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{v.name}</h1>
        <BookableChip claimed={v.claimed} />
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-mist">
        {v.category && <span>{serviceKindLabel(v.category)}</span>}
        {place && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden />
            {place}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-4" aria-hidden />
          {v.capacity
            ? `Up to ${v.capacity.toLocaleString('en')} guests`
            : 'Capacity not listed'}
        </span>
        {v.rating !== undefined && v.ratingCount !== undefined && (
          <span className="inline-flex items-center gap-1.5">
            <Star className="size-4 fill-flame text-flame" aria-hidden />
            {v.rating.toFixed(1)} ({v.ratingCount}{' '}
            {v.ratingCount === 1 ? 'rating' : 'ratings'})
          </span>
        )}
      </p>

      {v.description && (
        <p className="mt-6 text-lg leading-relaxed whitespace-pre-line">
          {v.description}
        </p>
      )}

      {v.amenities.length > 0 && (
        <section aria-label="Amenities" className="mt-8">
          <h2 className="text-xl font-bold">Amenities</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {v.amenities.map((a) => (
              <li
                key={a}
                className="rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold"
              >
                {a}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(website || socials.length > 0) && (
        <section aria-label="Links" className="mt-8">
          <h2 className="text-xl font-bold">Find them online</h2>
          <ul className="mt-3 flex flex-wrap gap-3">
            {website && (
              <li>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CTA.outline}
                >
                  <Globe className="size-4" aria-hidden />
                  Website
                </a>
              </li>
            )}
            {socials.map((s) => (
              <li key={s.platform}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${CTA.outline} capitalize`}
                >
                  {s.platform}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <HeldDates
        availability={v.claimed ? availability.data : { open: false, blocks: [] }}
        pending={v.claimed && availability.isPending}
        nowSec={nowSec}
      />

      <section
        aria-label="Request a booking"
        className="mt-10 rounded-2xl border border-line bg-card p-5"
      >
        <h2 className="text-lg font-bold">Want to hold {v.name}?</h2>
        {v.claimed ? (
          <>
            <p className="mt-1 text-mist">
              Organizers send booking requests in the portal, and the owner
              accepts or declines. Sign in to send one.
            </p>
            <a
              href={portalUrl('/login')}
              className={`${CTA.primary} mt-4`}
            >
              Sign in to request a booking
            </a>
          </>
        ) : (
          <p className="mt-1 text-mist">
            Booking isn't open for this listing yet.
          </p>
        )}
      </section>
    </div>
  )
}
