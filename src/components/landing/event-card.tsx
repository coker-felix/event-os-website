import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Heart, MapPin } from 'lucide-react'
import { eventParts, toDate } from '#/features/events/format'
import { availabilityBadge } from '#/features/events/availability'
import { formatPrice } from '#/features/events/money'
import { usePreferences } from '#/stores/preferences'
import type { PublicEvent } from '#/features/events/types'

const HEX_COLOR = /^#[0-9a-f]{6}$/i

/**
 * Event as a ticket stub: poster on top, tear line, date and price on the
 * stub. The whole card is one link (via the title); the save button sits
 * above it so it never navigates.
 */
export function EventCard({
  event,
  categoryName,
}: {
  event: PublicEvent
  categoryName?: string
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const saved = usePreferences((s) => s.saved.includes(event.id))
  const toggleSaved = usePreferences((s) => s.toggleSaved)

  const date = toDate(event.startsAt)
  const parts = date ? eventParts(date, event.timezone) : null
  const tint =
    event.accentColor && HEX_COLOR.test(event.accentColor)
      ? event.accentColor
      : '#5b3df5'
  const price = formatPrice(event.priceFromMinor, event.currency)
  const place = [event.venueName, event.city]
    .filter((x, i, a) => x && a.indexOf(x) === i)
    .join(' · ')
  const soldOut = event.availability === 'sold_out'
  const badge = availabilityBadge(event.availability)

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-card transition-shadow focus-within:ring-2 focus-within:ring-violet hover:shadow-lg">
      <div
        className="relative m-2 aspect-[4/3] overflow-hidden rounded-xl"
        style={{ background: `linear-gradient(135deg, ${tint}, #15122e)` }}
      >
        {event.heroImageUrl && !imageFailed && (
          <img
            src={event.heroImageUrl}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {categoryName && (
          <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink">
            {categoryName}
          </span>
        )}
        {badge && (
          <span
            className={`absolute bottom-2 left-2 rounded-full px-2.5 py-1 text-xs font-semibold text-white ${soldOut ? 'bg-ink' : 'bg-flame'}`}
          >
            {badge}
          </span>
        )}
      </div>

      <button
        type="button"
        aria-pressed={saved}
        aria-label={
          saved ? `Remove ${event.title} from saved` : `Save ${event.title}`
        }
        onClick={() => toggleSaved(event.id)}
        className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full bg-white/90 text-ink shadow-sm hover:bg-white"
      >
        <Heart
          className={
            saved ? 'size-5 fill-flame text-flame' : 'size-5'
          }
          aria-hidden
        />
      </button>

      <div className="flex-1 px-4 pt-2 pb-4">
        <h3 className="line-clamp-2 text-lg leading-snug font-bold">
          <Link
            to="/events/$eventId"
            params={{ eventId: event.id }}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {event.title}
          </Link>
        </h3>
        {event.promoTagline && (
          <p className="mt-1 line-clamp-1 text-sm text-mist">
            {event.promoTagline}
          </p>
        )}
        {place && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-mist">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{place}</span>
          </p>
        )}
      </div>

      <div className="stub-divider" aria-hidden />

      <div className="flex items-center gap-3 px-4 py-3">
        {parts && (
          <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-flame text-white">
            <span className="text-[0.65rem] leading-none font-bold tracking-wider uppercase">
              {parts.month}
            </span>
            <span className="font-display text-xl leading-none font-extrabold">
              {parts.day}
            </span>
          </div>
        )}
        <div className="min-w-0 text-sm">
          {parts && (
            <div className="font-semibold">
              {parts.weekday}, {parts.time}
            </div>
          )}
        </div>
        <div className="ml-auto text-right text-sm">
          {price && <div className="font-bold">{price === 'Free' ? 'Free' : `From ${price}`}</div>}
          <div className="font-semibold text-violet-ink group-hover:underline">
            {soldOut ? 'Join waitlist' : 'Get tickets'}
          </div>
        </div>
      </div>
    </article>
  )
}
