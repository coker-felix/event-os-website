import { queryOptions } from '@tanstack/react-query'
import { apiGet } from '#/lib/api'

export interface Country {
  code: string
  name: string
}

/** Enabled countries, for the billing country dropdown. */
export const countriesQuery = queryOptions({
  queryKey: ['countries'],
  queryFn: async (): Promise<Array<Country>> => {
    const res = await apiGet<{
      countries?: Array<{ code: string; name?: string; enabled?: boolean }>
    }>('/api/v1/countries')
    return (res.countries ?? [])
      .filter((c) => c.enabled !== false)
      .map((c) => ({ code: c.code, name: c.name ?? c.code }))
  },
  staleTime: 60 * 60 * 1000,
})
