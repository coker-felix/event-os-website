import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { MapPin, Users } from 'lucide-react'
import { serviceKindLabel } from '#/features/vendors/callouts'
import { safeHttpUrl } from '#/lib/url'
import { BookableChip } from './bookable-chip'
import type { VenueEntry } from '#/features/venues/types'

/** A directory entry. The API has no photos yet, so the header is a gradient. */
export function VenueCard({ venue }: { venue: VenueEntry }) {
  const [imageFailed, setImageFailed] = useState(false)
  const image = safeHttpUrl(venue.imageUrl)
  const place = [venue.city, venue.country].filter(Boolean).join(', ')
  return (
    <Link
      to="/venues/$venueId"
      params={{ venueId: venue.id }}
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
            {venue.name}
          </h3>
          <BookableChip claimed={venue.claimed} />
        </div>
        {venue.category && (
          <p className="mt-1 text-xs font-semibold tracking-[0.14em] text-violet-ink uppercase">
            {serviceKindLabel(venue.category)}
          </p>
        )}
        {place && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-mist">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {place}
          </p>
        )}
        <p className="mt-1 flex items-center gap-1.5 text-sm text-mist">
          <Users className="size-4 shrink-0" aria-hidden />
          {venue.capacity
            ? `Up to ${venue.capacity.toLocaleString('en')} guests`
            : 'Capacity not listed'}
        </p>
      </div>
    </Link>
  )
}
