import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, MapPin, Star } from 'lucide-react'
import { TierBadge } from '#/components/vendors/tier-badge'
import { VendorServices } from '#/components/vendors/vendor-services'
import { serviceKindLabel } from '#/features/vendors/callouts'
import { isVendorId } from '#/features/vendors/ids'
import { portalUrl } from '#/features/vendors/portal'
import { vendorQuery } from '#/features/vendors/queries'
import { ApiError } from '#/lib/api'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/vendors/$vendorId')({
  // Warm the cache on the server. A malformed id or a missing vendor is a real
  // 404; any other failure still renders, and the page shows a retry.
  loader: async ({ context: { queryClient }, params }) => {
    if (!isVendorId(params.vendorId)) throw notFound()
    try {
      const v = await queryClient.ensureQueryData(vendorQuery(params.vendorId))
      return {
        name: v.businessName,
        description:
          (v.description ?? '').slice(0, 160) ||
          [v.category && serviceKindLabel(v.category), v.city].filter(Boolean).join(' in '),
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound()
      return null
    }
  },
  notFoundComponent: VendorNotFound,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.name} | Event OS for Vendors`
          : 'Vendor | Event OS for Vendors',
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
  component: VendorPage,
})

function VendorNotFound() {
  return (
    <div className="rounded-2xl border border-line bg-card p-6" role="alert">
      <h1 className="text-2xl font-bold">We can't find that vendor</h1>
      <p className="mt-1 text-mist">
        They may have been removed or the link is wrong.
      </p>
      <Link
        to="/vendors/directory"
        className={`${CTA.primary} mt-4`}
      >
        Back to the directory
      </Link>
    </div>
  )
}

function VendorPage() {
  const { vendorId } = Route.useParams()
  const vendor = useQuery(vendorQuery(vendorId))

  if (vendor.isPending) {
    return (
      <p className="text-mist" role="status">
        Loading vendor…
      </p>
    )
  }
  if (vendor.isError) {
    if (vendor.error instanceof ApiError && vendor.error.status === 404) {
      return <VendorNotFound />
    }
    return (
      <div className="rounded-2xl border border-line bg-card p-6" role="alert">
        <h1 className="text-2xl font-bold">We couldn't load this vendor</h1>
        <p className="mt-1 text-mist">Check your connection, then try again.</p>
        <button
          type="button"
          onClick={() => void vendor.refetch()}
          className={`${CTA.primary} mt-4`}
        >
          Try again
        </button>
      </div>
    )
  }

  const v = vendor.data
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/vendors/directory"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Directory
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{v.businessName}</h1>
        <TierBadge tier={v.tier} />
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-mist">
        {v.category && <span>{serviceKindLabel(v.category)}</span>}
        {v.city && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden />
            {v.city}
          </span>
        )}
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

      <VendorServices services={v.services} />

      <section
        aria-label="Book this vendor"
        className="mt-10 rounded-2xl border border-line bg-card p-5"
      >
        <h2 className="text-lg font-bold">Want to book {v.businessName}?</h2>
        <p className="mt-1 text-mist">
          Organizers book vendors in the portal. Sign in to send a request.
        </p>
        <a
          href={portalUrl('/login')}
          className={`${CTA.primary} mt-4`}
        >
          Sign in to book
        </a>
      </section>
    </div>
  )
}
