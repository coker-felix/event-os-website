import { useCallback, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { HeroBanner } from '#/components/landing/hero-banner'
import { DiscoveryBar } from '#/components/landing/discovery-bar'
import { EventRow } from '#/components/landing/event-row'
import { EventCard } from '#/components/landing/event-card'
import { StatBand } from '#/components/landing/stat-band'
import { HowItWorks } from '#/components/landing/how-it-works'
import { PartnerStrip } from '#/components/landing/partner-strip'
import { FeaturedPosts } from '#/components/landing/featured-posts'
import { AlertsSignup } from '#/components/landing/alerts-signup'
import { FaqSection, faqJsonLd } from '#/components/landing/faq-section'
import { featuredPostsQuery } from '#/features/blog/queries'
import { platformStatsQuery } from '#/features/stats/queries'
import { categoriesQuery, eventsQuery } from '#/features/events/queries'
import {
  QUICK_FILTERS,
  citiesOf,
  filterEvents,
} from '#/features/events/filters'
import {
  byStart,
  isUpcoming,
  startsWithinWeek,
} from '#/features/events/format'
import { usePreferences } from '#/stores/preferences'
import type { DiscoveryValue } from '#/components/landing/discovery-bar'
import type { PublicEvent } from '#/features/events/types'
import type { QuickFilter } from '#/features/events/filters'
import { Reveal } from '#/components/motion/reveal'

const MAX_CATEGORY_ROWS = 3
const MAX_RESULTS = 24

interface LandingSearch {
  q?: string
  show?: QuickFilter
  cat?: number
}

export const Route = createFileRoute('/_attendee/')({
  validateSearch: (s: Record<string, unknown>): LandingSearch => {
    const q = typeof s.q === 'string' && s.q.trim() ? s.q.trim() : undefined
    const show = QUICK_FILTERS.find((f) => f.id === s.show)?.id
    const cat = Number.isInteger(Number(s.cat)) && Number(s.cat) > 0 ? Number(s.cat) : undefined
    return { q, show, cat }
  },
  head: () => ({
    meta: [
      { title: "See what's on near you | Event OS" },
      {
        name: 'description',
        content: 'Browse upcoming events and get your tickets in a few taps.',
      },
    ],
    scripts: [{ type: 'application/ld+json', children: faqJsonLd() }],
  }),
  // Warm the cache on the server. A failing API must never fail the page.
  loader: async ({ context: { queryClient } }) => {
    await Promise.allSettled([
      queryClient.ensureQueryData(eventsQuery),
      queryClient.ensureQueryData(categoriesQuery),
      queryClient.ensureQueryData(platformStatsQuery),
      queryClient.ensureQueryData(featuredPostsQuery),
    ])
  },
  component: Landing,
})

function Landing() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const events = useQuery(eventsQuery)
  const categories = useQuery(categoriesQuery)
  const stats = useQuery(platformStatsQuery).data
  const posts = useQuery(featuredPostsQuery).data

  const city = usePreferences((s) => s.city)
  const setCity = usePreferences((s) => s.setCity)
  const saved = usePreferences((s) => s.saved)

  const discovery = useMemo<DiscoveryValue>(
    () => ({ q: search.q, quick: search.show, categoryId: search.cat }),
    [search.q, search.show, search.cat],
  )
  const onFiltersChange = useCallback(
    (next: DiscoveryValue) =>
      void navigate({
        search: { q: next.q, show: next.quick, cat: next.categoryId },
        replace: true,
      }),
    [navigate],
  )

  const view = useMemo(() => {
    const now = Date.now()
    const upcoming = (events.data ?? [])
      .filter((e) => isUpcoming(e, now))
      .sort(byStart)
    const names = new Map(
      (categories.data ?? []).map((c) => [c.id, c.name] as const),
    )
    const cities = citiesOf(upcoming)
    const activeCity = city && cities.includes(city) ? city : null
    const base = activeCity
      ? upcoming.filter((e) => e.city === activeCity)
      : upcoming

    const filtersActive = !!(
      discovery.q ||
      discovery.quick ||
      discovery.categoryId !== undefined
    )
    const results = filtersActive
      ? filterEvents(
          base,
          {
            q: discovery.q,
            quick: discovery.quick,
            categoryId: discovery.categoryId,
          },
          names,
          now,
        )
      : []

    const thisWeek = base.filter((e) => startsWithinWeek(e, now))
    const byCategory = new Map<number, Array<PublicEvent>>()
    for (const e of base) {
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
        ? base.filter((e) => !thisWeek.includes(e))
        : []

    return {
      upcoming,
      base,
      names,
      cities,
      activeCity,
      filtersActive,
      results,
      thisWeek,
      categoryRows,
      comingUp,
      savedEvents: upcoming.filter((e) => saved.includes(e.id)),
    }
  }, [events.data, categories.data, city, discovery, saved])

  const where = view.activeCity ? ` in ${view.activeCity}` : ''

  return (
    <>
      <HeroBanner />

      <DiscoveryBar
        value={discovery}
        onChange={onFiltersChange}
        categories={categories.data ?? []}
        cities={view.cities}
        city={view.activeCity}
        onCityChange={setCity}
      />

      {events.isPending ? (
        <p className="mt-12 text-mist" role="status">
          Loading events…
        </p>
      ) : events.isError ? (
        <div
          className="mt-12 rounded-2xl border border-line bg-card p-6"
          role="alert"
        >
          <h2 className="text-xl font-bold">We couldn't load events</h2>
          <p className="mt-1 text-mist">Check your connection, then try again.</p>
          <button
            type="button"
            onClick={() => events.refetch()}
            className="mt-4 rounded-full bg-violet px-5 py-2 font-semibold text-white hover:opacity-90"
          >
            Try again
          </button>
        </div>
      ) : view.upcoming.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-line bg-card p-6">
          <h2 className="text-xl font-bold">No upcoming events yet</h2>
          <p className="mt-1 text-mist">
            New events are added all the time. Leave your details below and
            we'll tell you when something is on.
          </p>
        </div>
      ) : view.base.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-line bg-card p-6">
          <h2 className="text-xl font-bold">
            No upcoming events{where}
          </h2>
          <button
            type="button"
            onClick={() => setCity(null)}
            className="mt-3 rounded-full bg-violet px-5 py-2 font-semibold text-white hover:opacity-90"
          >
            Show all locations
          </button>
        </div>
      ) : view.filtersActive ? (
        <section aria-label="Search results" className="mt-10">
          <h2 className="text-2xl font-bold">
            {view.results.length === 0
              ? `No events match${where}`
              : `${view.results.length} ${view.results.length === 1 ? 'event' : 'events'}${where}`}
          </h2>
          {view.results.length === 0 ? (
            <p className="mt-1 text-mist">
              Try a different search, or clear the filters.
            </p>
          ) : (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {view.results.slice(0, MAX_RESULTS).map((e) => (
                <li key={e.id}>
                  <EventCard
                    event={e}
                    categoryName={
                      e.categoryId ? view.names.get(e.categoryId) : undefined
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <>
          <Reveal>
            <EventRow
              title="Saved for later"
              events={view.savedEvents}
              categoryNames={view.names}
            />
          </Reveal>
          <Reveal>
            <EventRow
              title={`Happening${where} this week`}
              events={view.thisWeek}
              categoryNames={view.names}
            />
          </Reveal>
          {view.categoryRows.map((r) => (
            <Reveal key={r.title}>
              <EventRow
                title={r.title}
                events={r.events}
                categoryNames={view.names}
              />
            </Reveal>
          ))}
          <Reveal>
            <EventRow
              title={`Coming up${where}`}
              events={view.comingUp}
              categoryNames={view.names}
            />
          </Reveal>
        </>
      )}

      <Reveal className="mt-12">
        <StatBand
          heading="Event OS in numbers"
          stats={[
            { value: stats?.events, label: 'Events to explore' },
            { value: stats?.categories, label: 'Kinds of events' },
            { value: stats?.countries, label: 'Countries' },
          ]}
        />
      </Reveal>

      <Reveal>
        <HowItWorks />
      </Reveal>

      <Reveal>
        <PartnerStrip />
      </Reveal>

      <Reveal className="mt-4 grid gap-4 md:grid-cols-2">
        <StatBand
          tone="dark"
          heading="Vendors on Event OS"
          stats={[
            { value: stats?.vendors, label: 'Vendors listed' },
            { value: stats?.callouts, label: 'Open callouts' },
          ]}
        />
        <StatBand
          tone="dark"
          heading="Venues on Event OS"
          stats={[{ value: stats?.venues, label: 'Venues listed' }]}
        />
      </Reveal>

      <Reveal>
        <FeaturedPosts posts={posts ?? []} />
      </Reveal>
      <Reveal>
        <AlertsSignup city={view.activeCity} />
      </Reveal>
      <Reveal>
        <FaqSection />
      </Reveal>
    </>
  )
}
