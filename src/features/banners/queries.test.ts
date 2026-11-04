import { describe, expect, it } from 'vitest'
import { normaliseBanners } from './queries'
import type { Banner } from './types'

const banner = (p: Partial<Banner>): Banner => ({
  id: 'b',
  type: 'platform',
  title: 'Title',
  ctaLabel: 'Go',
  href: '/events',
  ...p,
})

describe('normaliseBanners', () => {
  it('keeps a banner with a site path or an https link', () => {
    const out = normaliseBanners([
      banner({ id: '1', href: '/events' }),
      banner({ id: '2', href: 'https://example.com/x' }),
    ])
    expect(out.map((b) => b.id)).toEqual(['1', '2'])
  })

  it('drops a banner whose link could run script or leave the site oddly', () => {
    const out = normaliseBanners([
      banner({ id: 'js', href: 'javascript:alert(1)' }),
      banner({ id: 'proto', href: '//evil.example' }),
      banner({ id: 'bare', href: 'events' }),
      banner({ id: 'ok', href: '/blog' }),
    ])
    expect(out.map((b) => b.id)).toEqual(['ok'])
  })
})
