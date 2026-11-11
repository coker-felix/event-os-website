import { queryOptions } from '@tanstack/react-query'
import { apiGet } from '#/lib/api'

export interface PlatformStats {
  events: number | null
  categories: number | null
  countries: number | null
  vendors: number | null
  callouts: number | null
  venues: number | null
}

const STATS_TIMEOUT_MS = 60_000

/** Read `total` from a list endpoint without downloading the list. */
async function total(path: string): Promise<number | null> {
  const sep = path.includes('?') ? '&' : '?'
  const res = await apiGet<{ total?: number }>(`${path}${sep}limit=1&offset=0`, {
    timeoutMs: STATS_TIMEOUT_MS,
  })
  return typeof res.total === 'number' ? res.total : null
}

/**
 * Stats come from the totals of existing list endpoints. Each one fails on
 * its own: a stat whose call fails is `null` and simply isn't shown.
 */
export const platformStatsQuery = queryOptions({
  queryKey: ['platform-stats'],
  queryFn: async (): Promise<PlatformStats> => {
    const [events, categories, countries, vendors, callouts, venues] =
      await Promise.allSettled([
        total('/api/v1/events'),
        total('/api/v1/event-categories'),
        total('/api/v1/countries'),
        total('/api/v1/vendors'),
        total('/api/v1/vendor-callouts'),
        total('/api/v1/venues'),
      ])
    const v = (r: PromiseSettledResult<number | null>) =>
      r.status === 'fulfilled' ? r.value : null
    return {
      events: v(events),
      categories: v(categories),
      countries: v(countries),
      vendors: v(vendors),
      callouts: v(callouts),
      venues: v(venues),
    }
  },
  staleTime: 10 * 60 * 1000,
  retry: false,
})
