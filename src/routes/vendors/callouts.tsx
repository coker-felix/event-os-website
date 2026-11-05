import { useCallback, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalloutCard } from '#/components/vendors/callout-card'
import { CalloutFilters } from '#/components/vendors/callout-filters'
import { eventsQuery } from '#/features/events/queries'
import { calloutCategories, filterCallouts } from '#/features/vendors/callouts'
import { portalUrl } from '#/features/vendors/portal'
import { calloutsQuery } from '#/features/vendors/queries'
import { validateCalloutsSearch } from '#/features/vendors/search'
import { useCalloutCards } from '#/features/vendors/use-callout-cards'
import type { CalloutsSearch } from '#/features/vendors/search'
import { Reveal } from '#/components/motion/reveal'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/vendors/callouts')({
  validateSearch: (raw: Record<string, unknown>) => validateCalloutsSearch(raw),
  loaderDeps: ({ search }) => ({ category: search.category, page: search.page ?? 1 }),
  // Warm the cache on the server. A failing API must never fail the page.
  loader: async ({ context: { queryClient }, deps }) => {
    await Promise.allSettled([
      queryClient.ensureQueryData(calloutsQuery(deps)),
      queryClient.ensureQueryData(calloutsQuery({ page: 1 })),
      queryClient.ensureQueryData(eventsQuery),
    ])
  },
  head: () => ({
    meta: [
      { title: 'Open callouts | EventRail for Vendors' },
      {
        name: 'description',
        content:
          'Events looking for vendors right now. Browse open callouts by category and place, then sign in to apply.',
      },
    ],
  }),
  component: CalloutsPage,
})

function CalloutsPage() {
  // The router can hand us raw junk from the URL; clean it again here.
  const rawSearch = Route.useSearch()
  const search = useMemo(
    () => validateCalloutsSearch(rawSearch as Record<string, unknown>),
    [rawSearch],
  )
  const navigate = Route.useNavigate()
  const page = search.page ?? 1

  // The category is a server filter. The unfiltered first page gives the
  // category and city choices, so a filter never hides the other choices.
  const list = useCalloutCards({ category: search.category, page })
  const all = useCalloutCards({ page: 1 })

  const cards = useMemo(
    () => filterCallouts(list.cards, { city: search.city }),
    [list.cards, search.city],
  )
  const categories = useMemo(() => calloutCategories(all.cards), [all.cards])
  const cities = useMemo(
    () =>
      [...new Set(all.cards.map((c) => c.event?.city).filter((c): c is string => !!c))],
    [all.cards],
  )

  const setFilters = useCallback(
    (next: { category?: string; city?: string }) =>
      void navigate({ search: next as CalloutsSearch, replace: true }),
    [navigate],
  )
  const filtered = !!search.category || !!search.city

  return (
    <div>
      <h1 className="text-3xl font-bold">Open callouts</h1>
      <p className="mt-1 max-w-2xl text-mist">
        Events looking for vendors right now. Pick one that fits, then sign in
        to apply.
      </p>

      <div className="mt-6">
        <CalloutFilters
          categories={categories}
          cities={cities}
          category={search.category}
          city={search.city}
          onChange={setFilters}
        />
      </div>

      {list.isPending ? (
        <p className="mt-8 text-mist" role="status">
          Loading callouts…
        </p>
      ) : list.isError ? (
        <div className="mt-8 rounded-2xl border border-line bg-card p-6" role="alert">
          <h2 className="text-xl font-bold">We couldn't load callouts</h2>
          <p className="mt-1 text-mist">Check your connection, then try again.</p>
          <button
            type="button"
            onClick={list.refetch}
            className={`${CTA.primary} mt-4`}
          >
            Try again
          </button>
        </div>
      ) : cards.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-card p-6">
          {filtered ? (
            <>
              <h2 className="text-xl font-bold">No callouts match</h2>
              <p className="mt-1 text-mist">Try a different category or place.</p>
              <button
                type="button"
                onClick={() => setFilters({})}
                className={`${CTA.primary} mt-4`}
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">No open callouts right now</h2>
              <p className="mt-1 text-mist">
                Create your profile and you'll be ready when one opens.
              </p>
              <a
                href={portalUrl('/register')}
                className={`${CTA.primary} mt-4`}
              >
                Create your profile
              </a>
            </>
          )}
        </div>
      ) : (
        <>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, i) => (
              <Reveal as="li" key={c.callout.id} delayIndex={i}>
                <CalloutCard card={c} />
              </Reveal>
            ))}
          </ul>
          {list.hasMore && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() =>
                  void navigate({
                    search: { ...search, page: page + 1 },
                    replace: true,
                  })
                }
                className={CTA.outline}
              >
                Load more callouts
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
