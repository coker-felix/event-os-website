import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  consentCookie,
  createGatedStorage,
  parseConsent,
  readCookie,
  serializeConsent,
} from './consent'
import { PREFERENCE_KEYS, STORAGE } from './storage-registry'
import { useConsent } from '#/stores/consent'

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  }
}

describe('consent cookie', () => {
  it('round-trips both choices', () => {
    expect(parseConsent(serializeConsent('accepted', 1, 1), 1)).toBe('accepted')
    expect(parseConsent(serializeConsent('declined', 1, 1), 1)).toBe('declined')
  })

  it('rejects missing, malformed and other-version values', () => {
    expect(parseConsent(undefined)).toBeNull()
    expect(parseConsent('')).toBeNull()
    expect(parseConsent('junk')).toBeNull()
    expect(parseConsent(serializeConsent('accepted', 1, 1), 2)).toBeNull()
  })

  it('reads a named cookie from a header', () => {
    expect(readCookie('a=1; eos_consent=xyz; b=2', 'eos_consent')).toBe('xyz')
    expect(readCookie('a=1', 'eos_consent')).toBeUndefined()
  })

  it('builds a one-year Lax cookie, Secure only when asked', () => {
    const c = consentCookie('v')
    expect(c).toContain('Max-Age=31536000')
    expect(c).toContain('Path=/')
    expect(c).toContain('SameSite=Lax')
    expect(c).not.toContain('Secure')
    expect(consentCookie('v', 365, true)).toContain('Secure')
  })
})

describe('gated storage', () => {
  it('never writes while the gate is closed, but reads and removes', () => {
    const inner = memoryStorage({ a: '1' })
    const set = vi.spyOn(inner, 'setItem')
    const gated = createGatedStorage(() => false, inner)
    gated.setItem('b', '2')
    expect(set).not.toHaveBeenCalled()
    expect(gated.getItem('a')).toBe('1')
    gated.removeItem('a')
    expect(inner.data.has('a')).toBe(false)
  })

  it('writes through when the gate is open', () => {
    const inner = memoryStorage()
    createGatedStorage(() => true, inner).setItem('b', '2')
    expect(inner.data.get('b')).toBe('2')
  })
})

describe('storage registry', () => {
  it('has unique keys and the expected preference keys', () => {
    const keys = Object.values(STORAGE).map((s) => s.key)
    expect(new Set(keys).size).toBe(keys.length)
    expect(PREFERENCE_KEYS).toEqual([
      'event-os:preferences',
      'event-os:theme',
      'event-os:contact',
    ])
  })

  it('lists every event-os: key the source uses', () => {
    const known = new Set<string>(Object.values(STORAGE).map((s) => s.key))
    const files: string[] = []
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name)
        if (statSync(p).isDirectory()) walk(p)
        else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) files.push(p)
      }
    }
    walk('src')
    const found = new Set<string>()
    for (const f of files) {
      for (const m of readFileSync(f, 'utf8').matchAll(/['"`](event-os:[a-z-]+)['"`]/g)) {
        found.add(m[1])
      }
    }
    expect([...found].filter((k) => !known.has(k))).toEqual([])
  })
})

describe('useConsent', () => {
  let ls: ReturnType<typeof memoryStorage>
  let cookie: string
  beforeEach(() => {
    ls = memoryStorage()
    cookie = ''
    vi.stubGlobal('localStorage', ls)
    vi.stubGlobal('document', {
      get cookie() {
        return cookie
      },
      set cookie(v: string) {
        // keep only name=value, like a browser's read side
        cookie = v.split(';')[0]
      },
    })
    useConsent.setState({ status: 'loading', settingsOpen: false })
  })

  it('load() with no consent deletes stale preference keys and keeps the cart', () => {
    ls.data.set('event-os:preferences', '{}')
    ls.data.set('event-os:carts', '{}')
    useConsent.getState().load()
    expect(useConsent.getState().status).toBe('none')
    expect(ls.data.has('event-os:preferences')).toBe(false)
    expect(ls.data.has('event-os:carts')).toBe(true)
  })

  it('decline() deletes remembered details and keeps the cart', () => {
    ls.data.set('event-os:contact', '{"phone":"1"}')
    ls.data.set('event-os:carts', '{}')
    useConsent.getState().decline()
    expect(useConsent.getState().status).toBe('declined')
    expect(ls.data.has('event-os:contact')).toBe(false)
    expect(ls.data.has('event-os:carts')).toBe(true)
  })

  it('accept() sets the cookie and status, and runs onAccepted callbacks', () => {
    const cb = vi.fn()
    useConsent.getState().onAccepted(cb)
    useConsent.getState().accept()
    expect(useConsent.getState().status).toBe('accepted')
    expect(parseConsent(readCookie(cookie, 'eos_consent'))).toBe('accepted')
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('load() restores an earlier choice from the cookie', () => {
    useConsent.getState().accept()
    useConsent.setState({ status: 'loading' })
    useConsent.getState().load()
    expect(useConsent.getState().status).toBe('accepted')
  })

  it('forgetDetails() removes only the contact key', () => {
    ls.data.set('event-os:contact', 'x')
    ls.data.set('event-os:preferences', 'y')
    useConsent.getState().forgetDetails()
    expect(ls.data.has('event-os:contact')).toBe(false)
    expect(ls.data.has('event-os:preferences')).toBe(true)
  })
})
