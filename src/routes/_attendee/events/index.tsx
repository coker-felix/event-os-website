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
  PRICE_BANDS,
  validateEventsSearch,
} from '#/features/events/list-search'
import { categoriesQuery, eventsQuery } from '#/features/events/queries'
import { usePreferences } from '#/stores/preferences'
import type { EventsSearch } from '#/features/events/list-search'
import { Reveal } from '#/components/motion/reveal'
import { CTA } from '#/lib/cta'
import {
  CheckCircle2,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
} from 'lucide-react'

export const Route = createFileRoute('/_attendee/events/')({
  validateSearch: (raw: Record<string, unknown>) => validateEventsSearch(raw),
  head: () => ({
    meta: [
      { title: 'All events | EventRail' },
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
    (q: string | undefined) => onChange({ ...search, q, page: undefined }),
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

  const where = search.cities?.length === 1 ? search.cities[0] : undefined
  const listView = search.view === 'list'
  const selectedPrice = search.prices?.length === 1 ? search.prices[0] : ''
  const toggleCategory = (categoryId: number) => {
    const current = search.cats ?? []
    const cats = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId]
    onChange({
      ...search,
      cats: cats.length ? cats : undefined,
      page: undefined,
    })
  }

  return (
    <div className="space-y-10 sm:space-y-14">
      <section
        className="grid items-end gap-8 lg:grid-cols-[1fr_auto]"
        aria-labelledby="events-page-title"
      >
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-bold tracking-[0.16em] text-primary uppercase">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            Live directory
          </p>
          <h1
            id="events-page-title"
            className="mt-5 text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Find what’s on,{' '}
            <span className="text-primary">from dusk till dawn.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Explore gigs, dinners, screenings, and community gatherings. Filter
            by city, date, or price and find your next good night out.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:flex-col">
          <div className="rounded-2xl border border-line bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">Showing</p>
            <p className="mt-0.5 font-semibold">
              {events.isPending
                ? 'Finding events…'
                : `${view.filtered.length} upcoming ${view.filtered.length === 1 ? 'event' : 'events'}`}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">Locations</p>
            <p className="mt-0.5 font-semibold">
              {events.isPending
                ? 'Finding locations…'
                : view.cities.length
                  ? view.cities.slice(0, 3).join(', ')
                  : 'Across Ghana'}
            </p>
          </div>
        </div>
      </section>

      <section
        aria-label="Find events"
        className="rounded-3xl border border-line bg-card p-4 shadow-[0_8px_28px_rgba(29,74,53,0.04)] sm:p-6"
      >
        <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_auto_auto]">
          <SearchBox
            value={search.q ?? ''}
            onCommit={onQuery}
            placeholder="Search events or venues"
          />
          <label className="relative block">
            <span className="sr-only">Filter by city</span>
            <MapPin
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <select
              value={where ?? ''}
              onChange={(event) =>
                onChange({
                  ...search,
                  cities: event.target.value ? [event.target.value] : undefined,
                  page: undefined,
                })
              }
              className="h-12 w-full appearance-none rounded-sm border border-line bg-card pr-10 pl-11 text-sm"
            >
              <option value="">All locations</option>
              {view.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Filter by price</span>
            <select
              value={selectedPrice}
              onChange={(event) =>
                onChange({
                  ...search,
                  prices: event.target.value
                    ? [
                        event.target.value as NonNullable<
                          EventsSearch['prices']
                        >[number],
                      ]
                    : undefined,
                  page: undefined,
                })
              }
              className="h-12 w-full rounded-sm border border-line bg-card px-4 text-sm"
            >
              <option value="">Any price</option>
              {PRICE_BANDS.map((band) => (
                <option key={band.id} value={band.id}>
                  {band.label}
                </option>
              ))}
            </select>
          </label>
          <div className="hidden lg:block">
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
          <div className="hidden lg:block">
            <button
              type="button"
              onClick={() => onChange({ view: search.view })}
              className={CTA.outline}
            >
              Clear filters
            </button>
          </div>
          <div className="flex gap-3 lg:hidden">
            <FilterSheet
              search={search}
              onChange={onChange}
              counts={view.counts}
              categories={categories.data ?? []}
              cities={view.cities}
              activeCount={view.activeCount}
              resultCount={view.filtered.length}
            />
            <button
              type="button"
              onClick={() => onChange({ view: search.view })}
              className={`${CTA.outline} flex-1`}
            >
              Clear filters
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center">
          <p className="shrink-0 text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            Categories
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              aria-pressed={!search.cats?.length}
              onClick={() =>
                onChange({ ...search, cats: undefined, page: undefined })
              }
              className={`${!search.cats?.length ? CTA.chipOn : CTA.chipOff} shrink-0`}
            >
              All
            </button>
            {(categories.data ?? []).map((category) => (
              <button
                key={category.id}
                type="button"
                aria-pressed={!!search.cats?.includes(category.id)}
                onClick={() => toggleCategory(category.id)}
                className={`${search.cats?.includes(category.id) ? CTA.chipOn : CTA.chipOff} shrink-0`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <details className="mt-3 border-t border-line pt-3 lg:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="size-4" aria-hidden /> More filters
          </summary>
          <div className="pt-3">
            <FilterPanel
              search={search}
              onChange={onChange}
              counts={view.counts}
              categories={categories.data ?? []}
              cities={view.cities}
            />
          </div>
        </details>
        <details className="mt-3 hidden border-t border-line pt-3 lg:block">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="size-4" aria-hidden /> More filters
          </summary>
          <div className="grid gap-6 pt-3 sm:grid-cols-2 lg:grid-cols-4">
            <FilterPanel
              search={search}
              onChange={onChange}
              counts={view.counts}
              categories={categories.data ?? []}
              cities={view.cities}
            />
          </div>
        </details>
      </section>

      <section aria-label="Results" className="min-w-0 space-y-5">
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
            <h2 className="text-xl font-bold">No events match these filters</h2>
            <p className="mt-1 text-mist">
              Try removing a filter, or get a message when something new is on.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onChange({ view: search.view })}
                className={CTA.primary}
              >
                Clear all filters
              </button>
              <Link to="/" hash="alerts" className={CTA.outline}>
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
                  className={CTA.outline}
                >
                  Load more events
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section
        className="relative left-1/2 w-screen -translate-x-1/2 bg-secondary px-4 py-12 sm:px-8 sm:py-16 lg:py-20"
        aria-labelledby="events-how-title"
      >
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
              Fast &amp; Frictionless
            </p>
            <h2
              id="events-how-title"
              className="mt-3 max-w-lg text-3xl leading-tight font-semibold sm:text-4xl"
            >
              How EventRail ticketholding works
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Your ticket stays connected to the email or phone number you used
              at checkout, so you can get back to it when you need it.
            </p>
            <ol className="mt-7 space-y-5">
              {[
                [
                  'Choose an event',
                  'Find the event details, venue, and ticket option that work for you.',
                ],
                [
                  'Book your pass',
                  'Complete checkout with the contact details you want your ticket sent to.',
                ],
                [
                  'Open your ticket',
                  'Use your confirmation, or securely look up your ticket if you can’t find it.',
                ],
              ].map(([title, body], index) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <div className="pt-0.5">
                    <h3 className="text-sm font-bold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-line bg-card p-5 shadow-[0_12px_36px_rgba(29,74,53,0.08)] sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-secondary text-primary">
                  <CheckCircle2 className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-bold">Event details, all in one place</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Organizer, venue, and ticket information before you book.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-primary">
                EventRail events
              </span>
            </div>

            <div className="mt-6 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
              <article className="rounded-2xl border border-line bg-background p-4">
                <p className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                  Security
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" aria-hidden />
                  <h4 className="text-sm font-bold">Private ticket lookup</h4>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A one-time verification code confirms your contact before
                  tickets are shown.
                </p>
              </article>
              <article className="rounded-2xl border border-line bg-background p-4">
                <p className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                  Flexibility
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Smartphone className="size-4 text-primary" aria-hidden />
                  <h4 className="text-sm font-bold">Find your pass again</h4>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Look up tickets with the same email or phone number you used
                  at checkout.
                </p>
              </article>
            </div>

            <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-[#123f32] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="font-semibold">
                  Need to retrieve an existing pass?
                </p>
                <p className="mt-1 text-sm text-white/70">
                  Use our secure self-service ticket lookup.
                </p>
              </div>
              <Link
                to="/tickets/help"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-[#123f32] transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Find My Booking
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
