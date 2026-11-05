import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { availabilityBadge } from '#/features/events/availability'
import { eventParts, toDate } from '#/features/events/format'
import { formatPrice } from '#/features/events/money'
import type { PublicEvent } from '#/features/events/types'

const HEX_COLOR = /^#[0-9a-f]{6}$/i

/** Compact row for the list view. The title is the link for the whole row. */
export function EventListRow({
  event,
  categoryName,
}: {
  event: PublicEvent
  categoryName?: string
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const date = toDate(event.startsAt)
  const parts = date ? eventParts(date, event.timezone) : null
  const tint =
    event.accentColor && HEX_COLOR.test(event.accentColor)
      ? event.accentColor
      : '#176b5b'
  const price = formatPrice(event.priceFromMinor, event.currency)
  const place = [event.venueName, event.city]
    .filter((x, i, a) => x && a.indexOf(x) === i)
    .join(', ')
  const badge = availabilityBadge(event.availability)
  const soldOut = event.availability === 'sold_out'

  return (
    <article className="relative flex items-center gap-4 rounded-2xl border border-line bg-card p-3 transition-shadow focus-within:ring-2 focus-within:ring-violet hover:shadow-md">
      {parts && (
        <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-sm bg-flame text-ink">
          <span className="text-[0.65rem] leading-none font-bold tracking-wider uppercase">
            {parts.month}
          </span>
          <span className="font-display text-2xl leading-none font-extrabold">
            {parts.day}
          </span>
        </div>
      )}
      <div
        className="hidden size-16 shrink-0 overflow-hidden rounded-lg sm:block"
        style={{ background: `linear-gradient(135deg, ${tint}, #172a26)` }}
      >
        {event.heroImageUrl && !imageFailed && (
          <img
            src={event.heroImageUrl}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="size-full object-cover"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-bold">
          <Link
            to="/events/$eventId"
            params={{ eventId: event.id }}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {event.title}
          </Link>
        </h3>
        <p className="truncate text-sm text-mist">
          {[parts && `${parts.weekday}, ${parts.time}`, place]
            .filter(Boolean)
            .join(' · ')}
        </p>
        <p className="truncate text-xs text-mist">
          {[categoryName, badge].filter(Boolean).join(' · ')}
        </p>
      </div>
      <div className="shrink-0 text-right text-sm">
        {price && (
          <div className="font-bold">
            {price === 'Free' ? 'Free' : `From ${price}`}
          </div>
        )}
        <div className="font-semibold text-violet-ink">
          {soldOut ? 'Join waitlist' : 'Get tickets'}
        </div>
      </div>
    </article>
  )
}
