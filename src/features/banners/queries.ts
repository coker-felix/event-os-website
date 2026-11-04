import { queryOptions } from '@tanstack/react-query'
import { apiGet } from '#/lib/api'
import { MOCKS_ENABLED } from '#/lib/mocks'
import { isSafeHref } from '#/lib/url'
import { mockBanners } from '#/features/mocks/banners'
import { DEFAULT_BANNER } from './default-banner'
import type { Banner, BannersResponse } from './types'

const MAX_BANNERS = 5
/** Past this, show the default banner and stop waiting. */
const BANNER_TIMEOUT_MS = 3000
const HEX_COLOR = /^#[0-9a-f]{6}$/i

function isUsable(b: Banner, nowSec: number): boolean {
  if (!b.id || !b.title || !b.ctaLabel || !b.href) return false
  if (!isSafeHref(b.href)) return false
  if (b.startsAt && b.startsAt > nowSec) return false
  if (b.endsAt && b.endsAt < nowSec) return false
  return true
}

/** Drop unusable banners, sanitise colours, cap the count. */
export function normaliseBanners(
  banners: Array<Banner>,
  nowSec = Date.now() / 1000,
): Array<Banner> {
  return banners
    .filter((b) => isUsable(b, nowSec))
    .slice(0, MAX_BANNERS)
    .map((b) => ({
      ...b,
      accentColor:
        b.accentColor && HEX_COLOR.test(b.accentColor)
          ? b.accentColor
          : undefined,
    }))
}

export const bannersQuery = queryOptions({
  queryKey: ['banners'],
  queryFn: async () => {
    try {
      const res = await apiGet<BannersResponse>('/api/v1/banners', {
        timeoutMs: BANNER_TIMEOUT_MS,
      })
      return normaliseBanners(res.banners)
    } catch (err) {
      // The endpoint does not exist yet: show invented banners in dev only.
      if (MOCKS_ENABLED) return normaliseBanners(mockBanners())
      throw err
    }
  },
  staleTime: 5 * 60 * 1000,
  retry: false,
})

export { DEFAULT_BANNER }
