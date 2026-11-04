import { CalendarPlus, MapPin, Ticket } from 'lucide-react'
import { calendarLinks } from '#/features/events/calendar'
import { formatEventWhen, toDate } from '#/features/events/format'
import { FORMAT_LABELS } from '#/features/events/list-search'
import type { PublicEvent } from '#/features/events/types'

/** Title, date and time, calendar links, venue with a map link, and format. */
export function KeyFacts({ event }: { event: PublicEvent }) {
  const start = toDate(event.startsAt)
  const place = [event.venueName, event.city]
    .filter((x, i, a) => x && a.indexOf(x) === i)
    .join(', ')
  const links = calendarLinks(event, place || undefined)
  const format = event.attendanceType ? FORMAT_LABELS[event.attendanceType] : null

  return (
    <div>
      <h1 className="text-3xl leading-tight font-extrabold sm:text-4xl">
        {event.title}
      </h1>
      {event.promoTagline && (
        <p className="mt-2 text-lg text-mist">{event.promoTagline}</p>
      )}
      <ul className="mt-5 space-y-3 text-base">
        {start && (
          <li className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-semibold">
              {formatEventWhen(start, event.timezone)}
            </span>
            {links && (
              <span className="flex items-center gap-1.5 text-sm">
                <CalendarPlus className="size-4 text-violet" aria-hidden />
                <a
                  href={links.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-violet hover:underline"
                >
                  Google Calendar
                </a>
                <span aria-hidden>·</span>
                <a
                  href={links.ics}
                  download={`${event.title}.ics`}
                  className="font-semibold text-violet hover:underline"
                >
                  Download .ics
                </a>
              </span>
            )}
          </li>
        )}
        {place && (
          <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-5 text-mist" aria-hidden />
              {place}
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-violet hover:underline"
            >
              Map
            </a>
          </li>
        )}
        {format && (
          <li className="flex items-center gap-1.5 text-mist">
            <Ticket className="size-5" aria-hidden />
            {format}
          </li>
        )}
      </ul>
    </div>
  )
}
