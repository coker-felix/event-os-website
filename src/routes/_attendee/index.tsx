import { useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { HeroBanner } from '#/components/landing/hero-banner'
import { EventRow } from '#/components/landing/event-row'
import { PartnerStrip } from '#/components/landing/partner-strip'
import { categoriesQuery, eventsQuery } from '#/features/events/queries'
import {
  byStart,
  isUpcoming,
  startsWithinWeek,
} from '#/features/events/format'
import type { PublicEvent } from '#/features/events/types'

const MAX_CATEGORY_ROWS = 3

export const Route = createFileRoute('/_attendee/')({
  head: () => ({
    meta: [
      { title: "See what's on near you | Event OS" },
      {
        name: 'description',
        content:
          'Browse upcoming events and get your tickets in a few taps.',
      },
    ],
  }),
  // Warm the cache on the server. A failing API must never fail the page.
  loader: async ({ context: { queryClient } }) => {
    await Promise.allSettled([
      queryClient.ensureQueryData(eventsQuery),
      queryClient.ensureQueryData(categoriesQuery),
    ])
  },
  component: Landing,
})

function Landing() {
  const events = useQuery(eventsQuery)
  const categories = useQuery(categoriesQuery)

  const rows = useMemo(() => {
    const now = Date.now()
    const upcoming = (events.data ?? [])
      .filter((e) => isUpcoming(e, now))
      .sort(byStart)
    const thisWeek = upcoming.filter((e) => startsWithinWeek(e, now))
    const names = new Map(
      (categories.data ?? []).map((c) => [c.id, c.name] as const),
    )

    const byCategory = new Map<number, Array<PublicEvent>>()
    for (const e of upcoming) {
      if (!e.categoryId) continue
      byCategory.set(e.categoryId, [...(byCategory.get(e.categoryId) ?? []), e])
    }
    const categoryRows = [...byCategory.entries()]
      .filter(([id]) => names.has(id))
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, MAX_CATEGORY_ROWS)
      .map(([id, list]) => ({ title: names.get(id) as string, events: list }))

    const comingUp =
      categoryRows.length === 0
        ? upcoming.filter((e) => !thisWeek.includes(e))
        : []

    return { upcoming, thisWeek, categoryRows, comingUp, names }
  }, [events.data, categories.data])

  return (
    <>
      <HeroBanner />

      {events.isPending ? (
        <p className="mt-12 text-mist" role="status">
          Loading events…
        </p>
      ) : events.isError ? (
        <div className="mt-12 rounded-2xl border border-line bg-card p-6" role="alert">
          <h2 className="text-xl font-bold">We couldn't load events</h2>
          <p className="mt-1 text-mist">
            Check your connection, then try again.
          </p>
          <button
            type="button"
            onClick={() => events.refetch()}
            className="mt-4 rounded-full bg-violet px-5 py-2 font-semibold text-white hover:opacity-90"
          >
            Try again
          </button>
        </div>
      ) : rows.upcoming.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-line bg-card p-6">
          <h2 className="text-xl font-bold">No upcoming events yet</h2>
          <p className="mt-1 text-mist">
            New events are added all the time.{' '}
            <Link to="/blog" className="font-semibold text-violet hover:underline">
              Read the blog
            </Link>{' '}
            while you wait.
          </p>
        </div>
      ) : (
        <>
          <EventRow
            title="Happening this week"
            events={rows.thisWeek}
            categoryNames={rows.names}
          />
          {rows.categoryRows.map((r) => (
            <EventRow
              key={r.title}
              title={r.title}
              events={r.events}
              categoryNames={rows.names}
            />
          ))}
          <EventRow
            title="Coming up"
            events={rows.comingUp}
            categoryNames={rows.names}
          />
        </>
      )}

      <PartnerStrip />
    </>
  )
}
