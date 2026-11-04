import { describe, expect, it } from 'vitest'
import { safeLogoSrc, visibleBrands } from './visible'

describe('safeLogoSrc', () => {
  it('allows https URLs and files served from this site', () => {
    expect(safeLogoSrc('https://x.test/a.svg')).toBe('https://x.test/a.svg')
    expect(safeLogoSrc('/logos/a.svg')).toBe('/logos/a.svg')
  })
  it('rejects everything else', () => {
    for (const bad of ['http://x.test/a.svg', '//evil.test/a.svg', 'javascript:alert(1)', 'data:image/svg+xml,<svg/>', '', 'logos/a.svg'])
      expect(safeLogoSrc(bad)).toBeUndefined()
  })
})

describe('visibleBrands', () => {
  it('drops entries with no name and trims the rest', () => {
    expect(visibleBrands([{ name: '' }, { name: '  Acme ' }]).map((b) => b.name)).toEqual(['Acme'])
  })
  it('keeps a brand but drops an unsafe logo or link', () => {
    const [b] = visibleBrands([{ name: 'Acme', logo: 'javascript:1', href: 'http://acme.test' }])
    expect(b.logo).toBeUndefined()
    expect(b.href).toBeUndefined()
  })
  it('keeps a safe link', () => {
    expect(visibleBrands([{ name: 'Acme', href: 'https://acme.test' }])[0].href).toBe('https://acme.test')
  })
  it('removes duplicates ignoring case, and caps the list at 12', () => {
    expect(visibleBrands([{ name: 'Acme' }, { name: 'ACME' }]).length).toBe(1)
    expect(visibleBrands(Array.from({ length: 30 }, (_, i) => ({ name: `B${i}` }))).length).toBe(12)
  })
  it('is empty for an empty list', () => {
    expect(visibleBrands([])).toEqual([])
  })
})
