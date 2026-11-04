import { describe, expect, it } from 'vitest'
import { isSafeHref, safeHttpUrl, safeHttpsUrl } from './url'

describe('safeHttpUrl', () => {
  it('keeps http and https URLs', () => {
    expect(safeHttpUrl('https://example.com/a?b=1')).toBe('https://example.com/a?b=1')
    expect(safeHttpUrl('http://example.com')).toBe('http://example.com')
  })

  it('trims surrounding spaces', () => {
    expect(safeHttpUrl('  https://example.com ')).toBe('https://example.com')
  })

  it('rejects script and data URLs, in any letter case', () => {
    expect(safeHttpUrl('javascript:alert(1)')).toBeNull()
    expect(safeHttpUrl('JaVaScRiPt:alert(1)')).toBeNull()
    expect(safeHttpUrl('data:text/html,<b>x</b>')).toBeNull()
    expect(safeHttpUrl('vbscript:x')).toBeNull()
  })

  it('rejects anything that is not an absolute URL', () => {
    expect(safeHttpUrl('//evil.example')).toBeNull()
    expect(safeHttpUrl('/relative/path')).toBeNull()
    expect(safeHttpUrl('example.com')).toBeNull()
    expect(safeHttpUrl('https://')).toBeNull()
    expect(safeHttpUrl('')).toBeNull()
    expect(safeHttpUrl(undefined)).toBeNull()
  })
})

describe('safeHttpsUrl', () => {
  it('accepts https only', () => {
    expect(safeHttpsUrl('https://checkout.paystack.com/abc')).toBe(
      'https://checkout.paystack.com/abc',
    )
    expect(safeHttpsUrl('http://checkout.paystack.com/abc')).toBeNull()
    expect(safeHttpsUrl('javascript:alert(1)')).toBeNull()
  })
})

describe('isSafeHref', () => {
  it('accepts a site path and an http(s) URL', () => {
    expect(isSafeHref('/events')).toBe(true)
    expect(isSafeHref('/events/abc?x=1#top')).toBe(true)
    expect(isSafeHref('https://example.com')).toBe(true)
  })

  it('rejects protocol-relative, script and bare values', () => {
    expect(isSafeHref('//evil.example')).toBe(false)
    expect(isSafeHref('javascript:alert(1)')).toBe(false)
    expect(isSafeHref('events')).toBe(false)
    expect(isSafeHref('')).toBe(false)
    expect(isSafeHref('/\\evil.example')).toBe(false)
  })
})
