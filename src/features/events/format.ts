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

/** "Sat 15 Nov 2025 · 7:00 pm WAT", read in the event's own time zone. */
export function formatEventWhen(date: Date, tz?: string): string {
  const timeZone = zone(tz)
  const day = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(date)
  return `${day} · ${time}`
}

const WEEK_MS =7 * 24 * 60 * 60 * 1000

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

export function isRecurringEvent(event: PublicEvent): boolean {
  return Boolean(
    event.seriesId?.trim() ||
      event.parentEventId?.trim() ||
      event.recurrencePattern?.trim() ||
      event.recurrenceRule?.trim(),
  )
}

const WEEKDAYS: Record<string, string> = {
  MO: 'Monday',
  TU: 'Tuesday',
  WE: 'Wednesday',
  TH: 'Thursday',
  FR: 'Friday',
  SA: 'Saturday',
  SU: 'Sunday',
}

export function recurringSchedule(event: PublicEvent): string | undefined {
  if (!isRecurringEvent(event)) return undefined
  const ruleFrequency = event.recurrenceRule
    ?.match(/(?:^|;)FREQ=([^;]+)/i)?.[1]
    .toLowerCase()
  const configuredPattern = event.recurrencePattern?.toLowerCase()
  const pattern =
    configuredPattern && configuredPattern !== 'custom'
      ? configuredPattern
      : ruleFrequency ?? configuredPattern
  if (pattern === 'weekly') {
    const byDay = event.recurrenceRule?.match(/(?:^|;)BYDAY=([^;]+)/i)?.[1]
    const interval = Number(
      event.recurrenceRule?.match(/(?:^|;)INTERVAL=(\d+)/i)?.[1] ?? 1,
    )
    const days = byDay
      ?.split(',')
      .map((day) => WEEKDAYS[day.trim().slice(-2).toUpperCase()])
      .filter((day): day is string => Boolean(day))
    if (interval > 1) return `Every ${interval} weeks`
    if (days?.length === 1) return `Every ${days[0]}`
    if (days && days.length > 1) return `Every ${days.join(' & ')}`
    return 'Weekly'
  }
  if (pattern === 'daily') return 'Daily'
  if (pattern === 'monthly') return 'Monthly'
  if (pattern === 'quarterly') return 'Quarterly'
  if (pattern === 'yearly') return 'Yearly'
  return 'Recurring'
}
