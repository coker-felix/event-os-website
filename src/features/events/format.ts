import type { PublicEvent } from './types'

/** protojson serialises int64 as strings; accept seconds or milliseconds. */
export function toDate(ts: number | string | undefined): Date | null {
  if (ts === undefined || ts === '') return null
  const n = Number(ts)
  if (!Number.isFinite(n) || n <= 0) return null
  return new Date(n < 1e12 ? n * 1000 : n)
}

export function zone(tz?: string): string {
  if (!tz) return 'UTC'
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz })
    return tz
  } catch {
    return 'UTC'
  }
}

export function eventParts(date: Date, tz?: string) {
  const timeZone = zone(tz)
  const fmt = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-GB', { ...o, timeZone }).format(date)
  return {
    month: fmt({ month: 'short' }),
    day: fmt({ day: 'numeric' }),
    weekday: fmt({ weekday: 'short' }),
    time: fmt({ hour: 'numeric', minute: '2-digit', hour12: true }),
  }
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export function isUpcoming(e: PublicEvent, now: number): boolean {
  const end = toDate(e.endsAt) ?? toDate(e.startsAt)
  return !!end && end.getTime() >= now
}

export function startsWithinWeek(e: PublicEvent, now: number): boolean {
  const start = toDate(e.startsAt)
  return !!start && start.getTime() - now <= WEEK_MS
}

export function byStart(a: PublicEvent, b: PublicEvent): number {
  return (toDate(a.startsAt)?.getTime() ?? 0) - (toDate(b.startsAt)?.getTime() ?? 0)
}
