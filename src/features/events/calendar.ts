import { toDate } from './format'
import type { PublicEvent } from './types'

const TWO_HOURS_MS = 2 * 60 * 60 * 1000

/** `20251115T180000Z`: a moment as a UTC calendar timestamp. */
function stamp(d: Date): string {
  return d.toISOString().replace(/[-:]|\.\d{3}/g, '')
}

/** Escape text for an ICS property value. */
function icsText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/** "Add to calendar" links for an event, or null when it has no start time. */
export function calendarLinks(
  event: Pick<PublicEvent, 'id' | 'title' | 'startsAt' | 'endsAt'>,
  venue?: string,
): { google: string; ics: string } | null {
  const start = toDate(event.startsAt)
  if (!start) return null
  const end = toDate(event.endsAt) ?? new Date(start.getTime() + TWO_HOURS_MS)

  const google = new URL('https://calendar.google.com/calendar/render')
  google.searchParams.set('action', 'TEMPLATE')
  google.searchParams.set('text', event.title)
  google.searchParams.set('dates', `${stamp(start)}/${stamp(end)}`)
  if (venue) google.searchParams.set('location', venue)

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Event OS//Website//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@event-os`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${icsText(event.title)}`,
    ...(venue ? [`LOCATION:${icsText(venue)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return {
    google: google.toString(),
    ics: `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`,
  }
}
