import { useCallback, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { VenueCard } from '#/components/venues/venue-card'
import { VenueFilters } from '#/components/venues/venue-filters'
import { portalUrl } from '#/features/vendors/portal'
import { validateVenuesSearch } from '#/features/venues/search'
import { venueDirectoryQuery } from '#/features/venues/queries'
import {
  filterVenues,
  sortVenues,
  venueCities,
  venueCountries,
} from '#/features/venues/venues'
import type { VenuesSearch } from '#/features/venues/search'

export const Route = createFileRoute('/venues/directory')({
  validateSearch: (raw: Record<string, unknown>) => validateVenuesSearch(raw),
  loaderDeps: ({ search }) => ({ country: search.country, page: search.page ?? 1 }),
  // Warm the cache on the server. A failing API must never fail the page.
  loader: async ({ context: { queryClient }, deps }) => {
    await Promise.allSettled([
      queryClient.ensureQueryData(venueDirectoryQuery(deps)),
      queryClient.ensureQueryData(venueDirectoryQuery({ page: 1 })),
    ])
  },
  head: () => ({
    meta: [
      { title: 'Venue directory | Event OS for Venues' },
      {
        name: 'description',
        content:
          'Browse venues for your next event by place and size. Bookable venues are marked and listed first.',
      },
    ],
  }),
  component: DirectoryPage,
})

function DirectoryPage() {
  // The router can hand us raw junk from the URL; clean it again here.
  const rawSearch = Route.useSearch()
  const search = useMemo(
    () => validateVenuesSearch(rawSearch as Record<string, unknown>),
    [rawSearch],
  )
  const navigate = Route.useNavigate()
  const page = search.page ?? 1

  const list = useQuery(venueDirectoryQuery({ country: search.country, page }))
  // The unfiltered first page gives the menus, so a filter never hides the other choices.
  const all = useQuery(venueDirectoryQuery({ page: 1 }))
  const cities = useMemo(() => venueCities(all.data?.venues ?? []), [all.data])
  const countries = useMemo(() => venueCountries(all.data?.venues ?? []), [all.data])

  const venues = useMemo(
    () =>
      sortVenues(
        filterVenues(list.data?.venues ?? [], {
          city: search.city,
          country: search.country,
          minCapacity: search.minCapacity,
          bookableOnly: search.bookable,
        }),
      ),
    [list.data, search.city, search.country, search.minCapacity, search.bookable],
  )

  const setFilters = useCallback(
    (next: Omit<VenuesSearch, 'page'>) =>
      void navigate({ search: next as VenuesSearch, replace: true }),
    [navigate],
  )
  const filtered = !!(search.city || search.country || search.minCapacity || search.bookable)

  return (
    <div>
      <h1 className="text-3xl font-bold">Venue directory</h1>
      <p className="mt-1 max-w-2xl text-mist">
        Find a venue for your next event. Bookable venues take booking requests;
        listing-only entries are shown for reference.
      </p>

      <div className="mt-6">
        <VenueFilters
          cities={cities}
          countries={countries}
          value={{
            city: search.city,
            country: search.country,
            minCapacity: search.minCapacity,
            bookable: search.bookable,
          }}
          onChange={setFilters}
        />
      </div>

      {list.isPending ? (
        <p className="mt-8 text-mist" role="status">
          Loading venues…
        </p>
      ) : list.isError ? (
        <div className="mt-8 rounded-2xl border border-line bg-card p-6" role="alert">
          <h2 className="text-xl font-bold">We couldn't load the directory</h2>
          <p className="mt-1 text-mist">Check your connection, then try again.</p>
          <button
            type="button"
            onClick={() => void list.refetch()}
            className="mt-4 h-12 rounded-full bg-violet px-6 font-semibold text-white"
          >
            Try again
          </button>
        </div>
      ) : venues.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-card p-6">
          {filtered ? (
            <>
              <h2 className="text-xl font-bold">No venues match</h2>
              <p className="mt-1 text-mist">Try a different place or size.</p>
              <button
                type="button"
                onClick={() => setFilters({})}
                className="mt-4 h-12 rounded-full bg-violet px-6 font-semibold text-white"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">No venues listed yet</h2>
              <p className="mt-1 text-mist">
                List yours and be one of the first.
              </p>
              <a
                href={portalUrl('/register')}
                className="mt-4 inline-flex h-12 items-center rounded-full bg-violet px-6 font-semibold text-white"
              >
                List your venue
              </a>
            </>
          )}
        </div>
      ) : (
        <>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((v) => (
              <li key={v.id}>
                <VenueCard venue={v} />
              </li>
            ))}
          </ul>
          {list.data.hasMore && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() =>
                  void navigate({
                    search: { ...search, page: page + 1 },
                    replace: true,
                  })
                }
                className="h-12 rounded-full border border-line bg-card px-8 font-semibold"
              >
                Load more venues
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
