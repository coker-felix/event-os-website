export interface SupportHours {
  /** Working days, Sunday is 0. */
  days: ReadonlyArray<number>
  /** "HH:MM" in `timeZone`. */
  open: string
  close: string
  timeZone: string
}

/** Until the backend config carries hours (backend request section 6). */
export const SUPPORT_HOURS: SupportHours = {
  days: [1, 2, 3, 4, 5],
  open: '09:00',
  close: '18:00',
  timeZone: 'Africa/Lagos',
}

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** "09:00" becomes "9 AM" and "09:30" becomes "9:30 AM". */
function clock(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

/** Weekday (Sunday 0) and minutes since midnight, as seen in the time zone. */
function localTime(now: Date, timeZone: string): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return {
    day: SHORT_DAYS.indexOf(get('weekday')),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

/** Whether support is online now, and when it is back if not. */
export function supportStatus(
  now: Date,
  hours: SupportHours = SUPPORT_HOURS,
): { open: boolean; label: string } {
  const { day, minutes } = localTime(now, hours.timeZone)
  const opens = minutesOf(hours.open)
  const closes = minutesOf(hours.close)
  const working = hours.days.includes(day)

  if (working && minutes >= opens && minutes < closes) {
    return { open: true, label: "We're online now" }
  }
  const at = clock(hours.open)
  if (working && minutes < opens) {
    return { open: false, label: `Back today at ${at}` }
  }
  for (let ahead = 1; ahead <= 7; ahead++) {
    const next = (day + ahead) % 7
    if (hours.days.includes(next)) {
      const when = ahead === 1 ? 'tomorrow' : DAY_NAMES[next]
      return { open: false, label: `Back ${when} at ${at}` }
    }
  }
  return { open: false, label: 'Currently closed' }
}
