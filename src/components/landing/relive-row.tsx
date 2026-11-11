import { Link } from '@tanstack/react-router'
import { Camera, Play, Star } from 'lucide-react'
import { eventParts, toDate } from '#/features/events/format'
import type { PastEvent } from '#/features/discovery/types'

const MAX = 4

/** Photos and replays from events that have happened. Hidden when the API has none. */
export function ReliveRow({ events }: { events: Array<PastEvent> }) {
  const shown = events.slice(0, MAX)
  if (shown.length === 0) return null
  return (
    <section
      aria-label="Past events"
      className="relative left-1/2 mt-0 w-screen -translate-x-1/2 bg-[#eee8da] px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
              Past events
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Relive it
            </h2>
          </div>
          <p className="max-w-sm text-base text-mist">
            See what you missed, then catch the next one.
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <PastEventFeature event={shown[0]} featured />
          </div>
          {shown.length > 1 && (
            <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {shown.slice(1).map((event) => (
                <li key={event.id}>
                  <PastEventFeature event={event} featured={false} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

function PastEventFeature({
  event,
  featured,
}: {
  event: PastEvent
  featured: boolean
}) {
  const date = toDate(event.startsAt)
  const parts = date ? eventParts(date, event.timezone) : null
  const cover = event.coverUrl ?? event.photos.at(0)
  const photoCount = event.photoCount ?? event.photos.length
  return (
    <article
      className={`group relative h-full overflow-hidden rounded-3xl border border-foreground/10 bg-card ${featured ? '' : 'lg:flex lg:min-h-44'}`}
    >
      <div
        className={`relative overflow-hidden bg-secondary ${featured ? 'h-64 lg:h-80' : 'aspect-[4/3] lg:aspect-auto lg:w-2/5 lg:shrink-0'}`}
        style={
          event.accentColor ? { backgroundColor: event.accentColor } : undefined
        }
      >
        {cover && (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="size-full object-cover transition duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        {event.videoUrl && (
          <a
            href={event.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground"
          >
            <Play className="size-3.5 fill-current" aria-hidden />
            Watch replay
            <span className="sr-only">
              {' '}
              of {event.title} (opens in a new tab)
            </span>
          </a>
        )}
        {photoCount > 0 && (
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white">
            <Camera className="size-4" aria-hidden />
            {photoCount} photos
          </span>
        )}
      </div>
      <div
        className={`${featured ? 'p-5 sm:p-6' : 'flex flex-1 flex-col justify-center p-5'}`}
      >
        <h3
          className={`font-semibold leading-snug ${featured ? 'text-xl sm:text-2xl' : 'text-lg'}`}
        >
          <Link
            to="/events/$eventId"
            params={{ eventId: event.id }}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {event.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-mist">
          {[parts && `${parts.month} ${parts.day}`, event.city]
            .filter(Boolean)
            .join(' · ')}
        </p>
        {event.rating && (
          <p className="mt-3 inline-flex items-center gap-1 text-sm">
            <Star className="size-4 fill-current text-flame" aria-hidden />
            <span className="font-semibold">
              {event.rating.average.toFixed(1)}
            </span>
            <span className="text-mist">({event.rating.count})</span>
          </p>
        )}
      </div>
    </article>
  )
}
