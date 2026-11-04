import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { eventParts, toDate } from '#/features/events/format'
import type { PublicEvent } from '#/features/events/types'

const HEX_COLOR = /^#[0-9a-f]{6}$/i

const FORMAT_LABEL = {
  in_person: 'In person',
  virtual: 'Online',
  hybrid: 'In person + online',
} as const

/** Event as a ticket stub: poster on top, tear line, date on the stub. */
export function EventCard({
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
      : '#5b3df5'
  const format = event.attendanceType ? FORMAT_LABEL[event.attendanceType] : null

  return (
    <Link
      to="/events/$eventId"
      params={{ eventId: event.id }}
      className="group flex h-full flex-col rounded-2xl border border-line bg-card transition-shadow hover:shadow-lg focus-visible:shadow-lg"
    >
      <div
        className="relative m-2 aspect-[4/3] overflow-hidden rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${tint}, #15122e)`,
        }}
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
      </div>

      <div className="flex-1 px-4 pt-2 pb-4">
        <h3 className="line-clamp-2 text-lg leading-snug font-bold">
          {event.title}
        </h3>
        {event.promoTagline && (
          <p className="mt-1 line-clamp-1 text-sm text-mist">
            {event.promoTagline}
          </p>
        )}
      </div>

      <div className="stub-divider" aria-hidden />

      <div className="flex items-center gap-3 px-4 py-3">
        {parts && (
          <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-flame text-white">
            <span className="text-[0.65rem] leading-none font-bold uppercase tracking-wider">
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
          {format && <div className="text-mist">{format}</div>}
        </div>
        <span className="ml-auto text-sm font-semibold text-violet group-hover:underline">
          Get tickets
        </span>
      </div>
    </Link>
  )
}
