import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import {
  calloutTitle,
  closesInLabel,
  serviceKindLabel,
} from '#/features/vendors/callouts'
import { portalUrl } from '#/features/vendors/portal'
import { formatEventWhen, toDate } from '#/features/events/format'
import type { CalloutCard as Card } from '#/features/vendors/types'

const HEX_COLOR = /^#[0-9a-f]{6}$/i

/**
 * One open callout. Date, place and image come from the event it belongs to;
 * when the event is not known the card still shows the category and services.
 */
export function CalloutCard({ card }: { card: Card }) {
  const { callout, event } = card
  const [imageFailed, setImageFailed] = useState(false)
  const nowSec = useMemo(() => Math.floor(Date.now() / 1000), [])
  const closes = closesInLabel(callout.closesAt, nowSec)
  const start = toDate(event?.startsAt)
  const place = [event?.venueName, event?.city]
    .filter((x, i, a) => x && a.indexOf(x) === i)
    .join(', ')
  const tint =
    event?.accentColor && HEX_COLOR.test(event.accentColor)
      ? event.accentColor
      : '#0f766e'

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card">
      <div
        className="aspect-[16/9]"
        style={{ background: `linear-gradient(135deg, ${tint}, #15122e)` }}
      >
        {event?.heroImageUrl && !imageFailed && (
          <img
            src={event.heroImageUrl}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="size-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold tracking-[0.14em] text-violet-ink uppercase">
          {serviceKindLabel(callout.category)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-lg leading-snug font-bold">
          {calloutTitle(card)}
        </h3>
        {start && event && (
          <p className="mt-1 text-sm text-mist">
            {formatEventWhen(start, event.timezone)}
          </p>
        )}
        {place && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-mist">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{place}</span>
          </p>
        )}
        {callout.serviceKinds.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Services wanted">
            {callout.serviceKinds.map((k) => (
              <li
                key={k}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold"
              >
                {serviceKindLabel(k)}
              </li>
            ))}
          </ul>
        )}
        {closes && (
          <p
            className={`mt-3 text-sm font-semibold ${closes === 'Closed' ? 'text-mist' : 'text-flame'}`}
          >
            {closes}
          </p>
        )}
        <div className="mt-auto flex flex-wrap gap-3 pt-5">
          <a
            href={portalUrl('/login')}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-violet px-5 font-semibold text-white hover:opacity-90"
          >
            Sign in to apply
          </a>
          {event && (
            <Link
              to="/events/$eventId"
              params={{ eventId: event.id }}
              className="inline-flex h-12 items-center rounded-full border border-line px-5 font-semibold hover:border-foreground"
            >
              View event
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
