import { describe, expect, it } from 'vitest'
import { nextChoice, parseTheme, resolveTheme, themeScript } from './theme'

describe('theme logic', () => {
  it('resolves every choice against the device', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('light', false)).toBe('light')
    expect(resolveTheme('dark', true)).toBe('dark')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('cycles system, light, dark, system', () => {
    expect(nextChoice('system')).toBe('light')
    expect(nextChoice('light')).toBe('dark')
    expect(nextChoice('dark')).toBe('system')
  })

  it('treats unknown or corrupt values as system', () => {
    expect(parseTheme('banana')).toBe('system')
    expect(parseTheme(null)).toBe('system')
    expect(parseTheme(42)).toBe('system')
    expect(parseTheme('dark')).toBe('dark')
  })
})

/** Runs the head script against fakes and reports what it did to <html>. */
function runScript(opts: {
  stored?: string | null
  deviceDark: boolean
  storageThrows?: boolean
}) {
  const classes = new Set<string>()
  const style: Record<string, string> = {}
  const root = {
    classList: {
      toggle: (c: string, on: boolean) => void (on ? classes.add(c) : classes.delete(c)),
    },
    style,
  }
  const localStorage = {
    getItem: () => {
      if (opts.storageThrows) throw new Error('blocked')
      if (opts.stored === undefined || opts.stored === null) return null
      return JSON.stringify({ state: { choice: opts.stored }, version: 0 })
    },
  }
  const fn = new Function('localStorage', 'matchMedia', 'document', themeScript())
  fn(localStorage, () => ({ matches: opts.deviceDark }), { documentElement: root })
  return { dark: classes.has('dark'), scheme: style.colorScheme }
}

describe('themeScript', () => {
  it('honours an explicit dark choice on a light device', () => {
    expect(runScript({ stored: 'dark', deviceDark: false })).toEqual({ dark: true, scheme: 'dark' })
  })
  it('honours an explicit light choice on a dark device', () => {
    expect(runScript({ stored: 'light', deviceDark: true })).toEqual({ dark: false, scheme: 'light' })
  })
  it('follows the device for system, nothing stored, or a corrupt value', () => {
    expect(runScript({ stored: 'system', deviceDark: true }).dark).toBe(true)
    expect(runScript({ stored: null, deviceDark: true }).dark).toBe(true)
    expect(runScript({ stored: null, deviceDark: false }).dark).toBe(false)
    expect(runScript({ stored: 'banana', deviceDark: true }).dark).toBe(true)
  })
  it('does not throw when storage is blocked', () => {
    expect(() => runScript({ storageThrows: true, deviceDark: true })).not.toThrow()
    expect(runScript({ storageThrows: true, deviceDark: true }).dark).toBe(true)
  })
})
