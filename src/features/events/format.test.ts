import { describe, expect, it } from 'vitest'
import { formatEventWhen } from './format'

describe('formatEventWhen', () => {
  const start = new Date('2025-11-15T18:00:00Z')

  it('reads the date and time in the event time zone and names the zone', () => {
    const text = formatEventWhen(start, 'Africa/Lagos')
    expect(text).toContain('Sat')
    expect(text).toContain('15 Nov')
    expect(text).toMatch(/7:00\s?pm/i)
    expect(text).toMatch(/WAT|GMT\+1/)
  })

  it('falls back to UTC for a missing or invalid time zone', () => {
    expect(formatEventWhen(start, undefined)).toMatch(/6:00\s?pm/i)
    expect(formatEventWhen(start, 'Not/AZone')).toMatch(/6:00\s?pm/i)
  })
})
