import { Link } from '@tanstack/react-router'
import { Camera, Play, Star } from 'lucide-react'
import { eventParts, toDate } from '#/features/events/format'
import type { PastEvent } from '#/features/discovery/types'

/** A past event: its best photo, how many there are, and a replay if there is one. */
export function PastEventCard({ event }: { event: PastEvent }) {
  const date = toDate(event.startsAt)
  const parts = date ? eventParts(date, event.timezone) : null
  const cover = event.coverUrl ?? event.photos.at(0)
  const photoCount = event.photoCount ?? event.photos.length
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-line bg-card">
      <div
        className="relative aspect-[4/3] bg-secondary"
        style={event.accentColor ? { backgroundColor: event.accentColor } : undefined}
      >
        {cover && (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-ink/80 to-transparent p-3 text-xs font-medium text-white">
          {photoCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <Camera className="size-3.5" aria-hidden />
              {photoCount} photos
            </span>
          )}
        </div>
        {event.videoUrl && (
          <a
            href={event.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 z-10 inline-flex h-8 items-center gap-1.5 rounded-sm bg-white/90 px-2.5 text-xs font-medium text-ink hover:bg-white"
          >
            <Play className="size-3.5" aria-hidden />
            Watch replay
            <span className="sr-only"> of {event.title} (opens in a new tab)</span>
          </a>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-base leading-snug font-bold">
          <Link
            to="/events/$eventId"
            params={{ eventId: event.id }}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {event.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-mist">
          {[parts && `${parts.month} ${parts.day}`, event.city].filter(Boolean).join(' · ')}
        </p>
        {event.rating && (
          <p className="mt-2 inline-flex items-center gap-1 text-sm">
            <Star className="size-4 fill-current text-flame" aria-hidden />
            <span className="font-semibold">{event.rating.average.toFixed(1)}</span>
            <span className="text-mist">({event.rating.count})</span>
          </p>
        )}
      </div>
    </article>
  )
}
