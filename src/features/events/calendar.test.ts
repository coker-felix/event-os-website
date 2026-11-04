import { describe, expect, it } from 'vitest'
import { calendarLinks } from './calendar'

const secs = (iso: string) => String(Date.parse(iso) / 1000)
const event = {
  id: 'e1',
  title: 'Rooftop, Sunset; Sessions',
  startsAt: secs('2025-11-15T18:00:00Z'),
  endsAt: secs('2025-11-15T21:00:00Z'),
}
const icsText = (dataUrl: string) =>
  decodeURIComponent(dataUrl.replace('data:text/calendar;charset=utf-8,', ''))

describe('calendarLinks', () => {
  it('builds a Google Calendar link with UTC start and end', () => {
    const links = calendarLinks(event, 'The Terrace, Lagos')
    const url = new URL(links!.google)
    expect(url.origin + url.pathname).toBe('https://calendar.google.com/calendar/render')
    expect(url.searchParams.get('text')).toBe('Rooftop, Sunset; Sessions')
    expect(url.searchParams.get('dates')).toBe('20251115T180000Z/20251115T210000Z')
    expect(url.searchParams.get('location')).toBe('The Terrace, Lagos')
  })

  it('builds an ICS file with escaped text', () => {
    const ics = icsText(calendarLinks(event)!.ics)
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('DTSTART:20251115T180000Z')
    expect(ics).toContain('DTEND:20251115T210000Z')
    expect(ics).toContain('SUMMARY:Rooftop\\, Sunset\\; Sessions')
    expect(ics).toContain('UID:e1@event-os')
  })

  it('assumes two hours when the event has no end time', () => {
    const links = calendarLinks({ ...event, endsAt: undefined })
    expect(new URL(links!.google).searchParams.get('dates')).toBe(
      '20251115T180000Z/20251115T200000Z',
    )
  })

  it('returns null when the event has no usable start time', () => {
    expect(calendarLinks({ id: 'x', title: 'No date' })).toBeNull()
  })
})
