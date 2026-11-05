import { useMemo, useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { About } from '#/components/event-details/about'
import { EventHero } from '#/components/event-details/event-hero'
import { KeyFacts } from '#/components/event-details/key-facts'
import { MobileBuyBar } from '#/components/event-details/mobile-buy-bar'
import { SimilarEvents } from '#/components/event-details/similar-events'
import { Sponsors } from '#/components/event-details/sponsors'
import { TicketList } from '#/components/event-details/ticket-list'
import { buyErrorMessage } from '#/features/checkout/errors'
import { startCheckout } from '#/features/checkout/start'
import { isEventId } from '#/features/events/ids'
import { categoriesQuery } from '#/features/events/queries'
import { selectedLines, stepQty } from '#/features/tickets/state'
import { eventPageQuery } from '#/features/tickets/queries'
import { ApiError } from '#/lib/api'
import type { PublicTicketType } from '#/features/tickets/types'
import { EventMedia } from '#/components/organizers/event-media'
import { ReviewsSection } from '#/components/organizers/reviews-section'
import { HostedBy } from '#/components/organizers/hosted-by'
import { Reveal } from '#/components/motion/reveal'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/_attendee/events/$eventId/')({
  // Warm the cache on the server; a failing API must never fail the page.
  loader: async ({ context: { queryClient }, params }) => {
    if (!isEventId(params.eventId)) throw notFound()
    try {
      const { event } = await queryClient.ensureQueryData(
        eventPageQuery(params.eventId),
      )
      return {
        title: event.title,
        description: (event.promoTagline ?? event.description ?? '').slice(0, 160),
        image: event.heroImageUrl ?? '',
      }
    } catch (err) {
      // A missing event is a real 404 (right status, no soft 404 for search
      // engines). Any other failure still renders; the page shows a retry.
      if (err instanceof ApiError && err.status === 404) throw notFound()
      return null
    }
  },
  notFoundComponent: EventNotFound,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} | EventRail` : 'Event | EventRail' },
      ...(loaderData
        ? [
            { name: 'description', content: loaderData.description },
            { property: 'og:title', content: loaderData.title },
            { property: 'og:description', content: loaderData.description },
            ...(loaderData.image
              ? [{ property: 'og:image', content: loaderData.image }]
              : []),
          ]
        : []),
    ],
  }),
  component: EventDetailsPage,
})

function EventNotFound() {
  return (
    <div className="rounded-2xl border border-line bg-card p-6" role="alert">
      <h1 className="text-2xl font-bold">We can't find that event</h1>
      <p className="mt-1 text-mist">
        It may have been removed or the link is wrong.
      </p>
      <Link
        to="/events"
        className={`${CTA.primary} mt-4`}
      >
        Browse all events
      </Link>
    </div>
  )
}

function EventDetailsPage() {
  const { eventId } = Route.useParams()
  const navigate = Route.useNavigate()
  const pageQuery = useQuery(eventPageQuery(eventId))
  const categories = useQuery(categoriesQuery)

  const [qtys, setQtys] = useState<Record<string, number>>({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const names = useMemo(
    () => new Map((categories.data ?? []).map((c) => [c.id, c.name] as const)),
    [categories.data],
  )

  if (pageQuery.isPending) {
    return (
      <p className="text-mist" role="status">
        Loading event…
      </p>
    )
  }
  if (pageQuery.isError) {
    const missing =
      pageQuery.error instanceof ApiError && pageQuery.error.status === 404
    return (
      <div className="rounded-2xl border border-line bg-card p-6" role="alert">
        <h1 className="text-2xl font-bold">
          {missing ? "We can't find that event" : "We couldn't load this event"}
        </h1>
        <p className="mt-1 text-mist">
          {missing
            ? 'It may have been removed or the link is wrong.'
            : 'Check your connection, then try again.'}
        </p>
        <div className="mt-4 flex gap-3">
          {!missing && (
            <button
              type="button"
              onClick={() => pageQuery.refetch()}
              className={CTA.primary}
            >
              Try again
            </button>
          )}
          <Link
            to="/events"
            className={CTA.outline}
          >
            Browse all events
          </Link>
        </div>
      </div>
    )
  }

  const page = pageQuery.data
  const { event } = page

  const onStep = (type: PublicTicketType, dir: 1 | -1) =>
    setQtys((q) => ({ ...q, [type.id]: stepQty(type, q[type.id] ?? 0, dir) }))

  async function onBuy() {
    setBusy(true)
    setError(undefined)
    try {
      await startCheckout(eventId, selectedLines(qtys))
      await navigate({
        to: '/events/$eventId/checkout',
        params: { eventId },
      })
    } catch (err) {
      setError(buyErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="pb-24 lg:pb-0">
      <EventHero
        event={event}
        categoryName={event.categoryId ? names.get(event.categoryId) : undefined}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="min-w-0">
          {event.organizerName && (
            <div className="mb-4">
              <HostedBy id={event.organizerId} name={event.organizerName} />
            </div>
          )}
          <KeyFacts event={event} />
          <Reveal>
            <About text={event.description} />
          </Reveal>
          <Reveal>
            <Sponsors sponsors={page.sponsors} />
          </Reveal>
          <EventMedia eventId={event.id} title={event.title} />
          <ReviewsSection subject={{ kind: 'event', id: event.id }} />
        </div>

        <aside
          aria-label="Tickets"
          className="hidden self-start rounded-2xl border border-line bg-card p-5 lg:sticky lg:top-6 lg:block"
        >
          <TicketList
            page={page}
            qtys={qtys}
            onStep={onStep}
            variant="panel"
            onBuy={onBuy}
            busy={busy}
            error={error}
          />
        </aside>
      </div>

      <Reveal>
        <SimilarEvents current={event} />
      </Reveal>

      <MobileBuyBar
        page={page}
        qtys={qtys}
        onStep={onStep}
        onBuy={onBuy}
        busy={busy}
        error={error}
      />
    </div>
  )
}
