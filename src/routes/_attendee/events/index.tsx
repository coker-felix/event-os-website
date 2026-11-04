import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ActiveFilters } from '#/components/events/active-filters'
import { EventListRow } from '#/components/events/event-list-row'
import { FilterPanel, SearchBox } from '#/components/events/filter-panel'
import { FilterSheet } from '#/components/events/filter-sheet'
import { ResultsHeader } from '#/components/events/results-header'
import { EventCard } from '#/components/landing/event-card'
import { citiesOf } from '#/features/events/filters'
import { isUpcoming } from '#/features/events/format'
import {
  activeFilterChips,
  applyEventsSearch,
  facetCounts,
  paginate,
  validateEventsSearch,
} from '#/features/events/list-search'
import { categoriesQuery, eventsQuery } from '#/features/events/queries'
import { usePreferences } from '#/stores/preferences'
import type { EventsSearch } from '#/features/events/list-search'
import { Reveal } from '#/components/motion/reveal'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/_attendee/events/')({
  validateSearch: (raw: Record<string, unknown>) => validateEventsSearch(raw),
  head: () => ({
    meta: [
      { title: 'All events | Event OS' },
      {
        name: 'description',
        content:
          'Browse every upcoming event. Filter by city, date, price and category, then get your tickets.',
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
  component: EventsPage,
})

function EventsPage() {
  // The router can hand us raw junk from the URL; clean it again here.
  const rawSearch = Route.useSearch()
  const search = useMemo(
    () => validateEventsSearch(rawSearch as Record<string, unknown>),
    [rawSearch],
  )
  const navigate = Route.useNavigate()
  const events = useQuery(eventsQuery)
  const categories = useQuery(categoriesQuery)
  const savedCity = usePreferences((s) => s.city)

  const onChange = useCallback(
    (next: EventsSearch) => void navigate({ search: next, replace: true }),
    [navigate],
  )
  const onQuery = useCallback(
    (q: string | undefined) =>
      onChange({ ...search, q, page: undefined }),
    [onChange, search],
  )

  // Start from the saved city once, unless the URL already says otherwise.
  const seeded = useRef(false)
  useEffect(() => {
    if (seeded.current || !savedCity) return
    seeded.current = true
    if (!search.cities) onChange({ ...search, cities: [savedCity] })
  }, [savedCity, search, onChange])

  const names = useMemo(
    () => new Map((categories.data ?? []).map((c) => [c.id, c.name] as const)),
    [categories.data],
  )

  const view = useMemo(() => {
    const now = Date.now()
    const upcoming = (events.data ?? []).filter((e) => isUpcoming(e, now))
    const filtered = applyEventsSearch(upcoming, search, names, now)
    return {
      cities: citiesOf(upcoming),
      counts: facetCounts(upcoming, search, names, now),
      filtered,
      page: paginate(filtered, search.page),
      activeCount: activeFilterChips(search, names).length,
    }
  }, [events.data, search, names])

  const where =
    search.cities?.length === 1 ? search.cities[0] : undefined
  const listView = search.view === 'list'

  return (
    <div>
      <h1 className="text-3xl font-bold">All events</h1>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <aside
          aria-label="Filters"
          className="hidden w-64 shrink-0 space-y-4 lg:block"
        >
          <SearchBox value={search.q ?? ''} onCommit={onQuery} />
          <FilterPanel
            search={search}
            onChange={onChange}
            counts={view.counts}
            categories={categories.data ?? []}
            cities={view.cities}
          />
        </aside>

        <section aria-label="Results" className="min-w-0 flex-1 space-y-4">
          <div className="flex gap-3 lg:hidden">
            <SearchBox
              value={search.q ?? ''}
              onCommit={onQuery}
              className="flex-1"
            />
            <FilterSheet
              search={search}
              onChange={onChange}
              counts={view.counts}
              categories={categories.data ?? []}
              cities={view.cities}
              activeCount={view.activeCount}
              resultCount={view.filtered.length}
            />
          </div>

          <ActiveFilters search={search} names={names} onChange={onChange} />

          {events.isPending ? (
            <p className="text-mist" role="status">
              Loading events…
            </p>
          ) : events.isError ? (
            <div
              className="rounded-2xl border border-line bg-card p-6"
              role="alert"
            >
              <h2 className="text-xl font-bold">We couldn't load events</h2>
              <p className="mt-1 text-mist">
                Check your connection, then try again.
              </p>
              <button
                type="button"
                onClick={() => events.refetch()}
                className={`${CTA.primary} mt-4`}
              >
                Try again
              </button>
            </div>
          ) : view.filtered.length === 0 ? (
            <div className="rounded-2xl border border-line bg-card p-6">
              <h2 className="text-xl font-bold">
                No events match these filters
              </h2>
              <p className="mt-1 text-mist">
                Try removing a filter, or get a message when something new is
                on.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onChange({ view: search.view })}
                  className={`${CTA.primary}`}
                >
                  Clear all filters
                </button>
                <Link
                  to="/"
                  hash="alerts"
                  className={`${CTA.outline}`}
                >
                  Notify me
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ResultsHeader
                count={view.filtered.length}
                where={where}
                search={search}
                onChange={onChange}
              />
              <ul
                className={
                  listView
                    ? 'space-y-3'
                    : 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
                }
              >
                {view.page.items.map((e, i) => (
                  <Reveal as="li" key={e.id} delayIndex={i}>
                    {listView ? (
                      <EventListRow
                        event={e}
                        categoryName={
                          e.categoryId ? names.get(e.categoryId) : undefined
                        }
                      />
                    ) : (
                      <EventCard
                        event={e}
                        categoryName={
                          e.categoryId ? names.get(e.categoryId) : undefined
                        }
                      />
                    )}
                  </Reveal>
                ))}
              </ul>
              {view.page.hasMore && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({ ...search, page: (search.page ?? 1) + 1 })
                    }
                    className={`${CTA.outline}`}
                  >
                    Load more events
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
