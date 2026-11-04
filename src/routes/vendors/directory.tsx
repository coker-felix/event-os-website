import { useCallback, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { CalloutFilters } from '#/components/vendors/callout-filters'
import { VendorCard } from '#/components/vendors/vendor-card'
import { portalUrl } from '#/features/vendors/portal'
import { vendorDirectoryQuery } from '#/features/vendors/queries'
import { validateDirectorySearch } from '#/features/vendors/search'
import type { DirectorySearch } from '#/features/vendors/search'
import { Reveal } from '#/components/motion/reveal'

export const Route = createFileRoute('/vendors/directory')({
  validateSearch: (raw: Record<string, unknown>) => validateDirectorySearch(raw),
  loaderDeps: ({ search }) => ({
    category: search.category,
    city: search.city,
    page: search.page ?? 1,
  }),
  // Warm the cache on the server. A failing API must never fail the page.
  loader: async ({ context: { queryClient }, deps }) => {
    await Promise.allSettled([
      queryClient.ensureQueryData(vendorDirectoryQuery(deps)),
      queryClient.ensureQueryData(vendorDirectoryQuery({ page: 1 })),
    ])
  },
  head: () => ({
    meta: [
      { title: 'Vendor directory | Event OS for Vendors' },
      {
        name: 'description',
        content:
          'Browse vendors on Event OS: caterers, sound, staging and more. Verified and partnered vendors are marked.',
      },
    ],
  }),
  component: DirectoryPage,
})

function DirectoryPage() {
  // The router can hand us raw junk from the URL; clean it again here.
  const rawSearch = Route.useSearch()
  const search = useMemo(
    () => validateDirectorySearch(rawSearch as Record<string, unknown>),
    [rawSearch],
  )
  const navigate = Route.useNavigate()
  const page = search.page ?? 1

  const list = useQuery(
    vendorDirectoryQuery({ category: search.category, city: search.city, page }),
  )
  // The unfiltered first page gives the filter choices, so a filter never
  // hides the others. Entries without a category or city add no choice.
  const all = useQuery(vendorDirectoryQuery({ page: 1 }))
  const categories = useMemo(
    () => [...new Set((all.data?.vendors ?? []).map((v) => v.category).filter((c): c is string => !!c))],
    [all.data],
  )
  const cities = useMemo(
    () => [...new Set((all.data?.vendors ?? []).map((v) => v.city).filter((c): c is string => !!c))],
    [all.data],
  )

  const setFilters = useCallback(
    (next: { category?: string; city?: string }) =>
      void navigate({ search: next as DirectorySearch, replace: true }),
    [navigate],
  )
  const filtered = !!search.category || !!search.city
  const vendors = list.data?.vendors ?? []

  return (
    <div>
      <h1 className="text-3xl font-bold">Vendor directory</h1>
      <p className="mt-1 max-w-2xl text-mist">
        Vendors on Event OS. Verified and partnered vendors are marked.
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
          Loading vendors…
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
      ) : vendors.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-card p-6">
          {filtered ? (
            <>
              <h2 className="text-xl font-bold">No vendors match</h2>
              <p className="mt-1 text-mist">Try a different category or place.</p>
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
              <h2 className="text-xl font-bold">No vendors listed yet</h2>
              <p className="mt-1 text-mist">
                Create your profile to be one of the first.
              </p>
              <a
                href={portalUrl('/register')}
                className="mt-4 inline-flex h-12 items-center rounded-full bg-violet px-6 font-semibold text-white"
              >
                Create your profile
              </a>
            </>
          )}
        </div>
      ) : (
        <>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((v, i) => (
              <Reveal as="li" key={v.id} delayIndex={i}>
                <VendorCard vendor={v} />
              </Reveal>
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
                Load more vendors
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
