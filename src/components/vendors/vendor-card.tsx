import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import { serviceKindLabel } from '#/features/vendors/callouts'
import { safeHttpUrl } from '#/lib/url'
import { TierBadge } from './tier-badge'
import type { VendorEntry } from '#/features/vendors/types'

/** A directory entry. Category, city, summary and photo show only when present. */
export function VendorCard({ vendor }: { vendor: VendorEntry }) {
  const [imageFailed, setImageFailed] = useState(false)
  const image = safeHttpUrl(vendor.imageUrl)
  return (
    <Link
      to="/vendors/$vendorId"
      params={{ vendorId: vendor.id }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition-shadow hover:shadow-lg focus-visible:shadow-lg"
    >
      <div className="aspect-[16/9] bg-gradient-to-br from-violet to-ink">
        {image && !imageFailed && (
          <img
            src={image}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="size-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg leading-snug font-bold group-hover:underline">
            {vendor.businessName}
          </h3>
          <TierBadge tier={vendor.tier} />
        </div>
        {vendor.category && (
          <p className="mt-1 text-xs font-semibold tracking-[0.14em] text-violet uppercase">
            {serviceKindLabel(vendor.category)}
          </p>
        )}
        {vendor.city && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-mist">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {vendor.city}
          </p>
        )}
        {vendor.summary && (
          <p className="mt-2 line-clamp-3 text-sm text-mist">{vendor.summary}</p>
        )}
      </div>
    </Link>
  )
}
