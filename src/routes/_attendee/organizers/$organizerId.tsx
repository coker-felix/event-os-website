import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { MapPin } from 'lucide-react'
import { EventCard } from '#/components/landing/event-card'
import { Reveal } from '#/components/motion/reveal'
import { FollowButton } from '#/components/organizers/follow-button'
import { OrganizerAvatar } from '#/components/organizers/organizer-avatar'
import { PastEventCard } from '#/components/organizers/past-event-card'
import { isOrganizerId } from '#/features/discovery/ids'
import { organizerQuery, pastEventsQuery } from '#/features/discovery/queries'
import { categoriesQuery, eventsQuery } from '#/features/events/queries'
import { ApiError } from '#/lib/api'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/_attendee/organizers/$organizerId')({
  // A malformed id or a missing organizer is a real 404; any other failure
  // still renders, and the page shows a retry.
  loader: async ({ context: { queryClient }, params }) => {
    if (!isOrganizerId(params.organizerId)) throw notFound()
    try {
      const o = await queryClient.ensureQueryData(organizerQuery(params.organizerId))
      await Promise.allSettled([
        queryClient.ensureQueryData(eventsQuery),
        queryClient.ensureQueryData(pastEventsQuery({ organizerId: params.organizerId })),
      ])
      return { name: o.name, description: (o.bio ?? '').slice(0, 160) || `Events hosted by ${o.name}` }
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound()
      return null
    }
  },
  notFoundComponent: OrganizerNotFound,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} | Event OS` : 'Organizer | Event OS' },
      ...(loaderData
        ? [
            { name: 'description', content: loaderData.description },
            { property: 'og:title', content: loaderData.name },
          ]
        : []),
    ],
  }),
  component: OrganizerPage,
})

function OrganizerNotFound() {
  return (
    <div className="rounded-2xl border border-line bg-card p-6" role="alert">
      <h1 className="text-2xl font-bold">We can't find that organizer</h1>
      <p className="mt-1 text-mist">They may have been removed or the link is wrong.</p>
      <Link to="/events" className={`${CTA.primary} mt-4`}>
        Browse all events
      </Link>
    </div>
  )
}

function OrganizerPage() {
  const { organizerId } = Route.useParams()
  const org = useQuery(organizerQuery(organizerId))
  const events = useQuery(eventsQuery)
  const past = useQuery(pastEventsQuery({ organizerId }))
  const categories = useQuery(categoriesQuery)
  const names = new Map((categories.data ?? []).map((c) => [c.id, c.name] as const))

  if (org.isPending) {
    return (
      <p className="text-mist" role="status">
        Loading organizer…
      </p>
    )
  }
  if (org.isError) {
    return (
      <div className="rounded-2xl border border-line bg-card p-6" role="alert">
        <h1 className="text-2xl font-bold">We couldn't load this organizer</h1>
        <p className="mt-1 text-mist">Check your connection, then try again.</p>
        <button type="button" onClick={() => org.refetch()} className={`${CTA.primary} mt-4`}>
          Try again
        </button>
      </div>
    )
  }

  const o = org.data
  const upcoming = (events.data ?? []).filter((e) => e.organizerId === organizerId)
  const pastEvents = past.data ?? []

  return (
    <div>
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <OrganizerAvatar name={o.name} logoUrl={o.logoUrl} size="lg" />
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold">{o.name}</h1>
            {o.city && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-mist">
                <MapPin className="size-4" aria-hidden />
                {o.city}
              </p>
            )}
            {o.hostedCount !== undefined && o.hostedCount > 0 && (
              <p className="mt-1 text-sm text-mist">{o.hostedCount} events hosted</p>
            )}
            {o.bio && <p className="mt-3 max-w-xl">{o.bio}</p>}
          </div>
        </div>
        <FollowButton id={o.id} name={o.name} />
      </header>

      {upcoming.length > 0 && (
        <section aria-label="Upcoming events" className="mt-12">
          <h2 className="text-2xl font-bold">Upcoming events</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {upcoming.map((e, i) => (
              <Reveal as="li" key={e.id} delayIndex={i}>
                <EventCard
                  event={e}
                  categoryName={e.categoryId ? names.get(e.categoryId) : undefined}
                />
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      {pastEvents.length > 0 && (
        <section aria-label="Past events" className="mt-12">
          <h2 className="text-2xl font-bold">Past events</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pastEvents.map((e, i) => (
              <Reveal as="li" key={e.id} delayIndex={i}>
                <PastEventCard event={e} />
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      {upcoming.length === 0 && pastEvents.length === 0 && (
        <p className="mt-12 text-mist">
          Nothing to show yet. Follow {o.name} to hear when they announce an event.
        </p>
      )}
    </div>
  )
}
