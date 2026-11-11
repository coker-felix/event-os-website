import { queryOptions } from '@tanstack/react-query'
import { apiGet } from '#/lib/api'
import { MOCKS_ENABLED } from '#/lib/mocks'
import {
  normaliseCalloutList,
  normaliseVendorList,
  normaliseVendorProfile,
} from './normalise'
import type { CalloutList, VendorList, VendorProfile } from './types'

export const VENDORS_PAGE_SIZE = 12
/** In development the directory is padded with invented vendors up to this many. */
const MOCK_FILL = 6

function limitFor(page: number): number {
  return VENDORS_PAGE_SIZE * Math.max(1, page)
}

/** Open callouts. "Load more" asks for a longer first page. */
export const calloutsQuery = (p: { category?: string; page: number }) => {
  const limit = limitFor(p.page)
  return queryOptions({
    queryKey: ['vendors', 'callouts', p.category ?? '', limit],
    queryFn: async (): Promise<CalloutList> => {
      const qs = new URLSearchParams({ limit: String(limit), offset: '0' })
      if (p.category) qs.set('category', p.category)
      const raw = await apiGet<Record<string, unknown>>(
        `/api/v1/vendor-callouts?${qs.toString()}`,
        { timeoutMs: 60_000 },
      )
      const list = normaliseCalloutList(raw, limit)
      // Dev only: with no open callouts, invented ones stand in so the pages can be seen.
      if (MOCKS_ENABLED && list.callouts.length === 0) {
        const { mockCallouts } = await import('./mocks')
        const fill = mockCallouts([]).filter(
          (c) => !p.category || c.category === p.category,
        )
        return { callouts: fill, hasMore: false }
      }
      return list
    },
    staleTime: 60 * 1000,
    retry: false,
  })
}

/** The public vendor directory. `city` is the API's `locality` filter. */
export const vendorDirectoryQuery = (p: {
  category?: string
  city?: string
  page: number
}) => {
  const limit = limitFor(p.page)
  return queryOptions({
    queryKey: ['vendors', 'directory', p.category ?? '', p.city ?? '', limit],
    queryFn: async (): Promise<VendorList> => {
      const qs = new URLSearchParams({ limit: String(limit), offset: '0' })
      if (p.category) qs.set('category', p.category)
      if (p.city) qs.set('locality', p.city)
      const raw = await apiGet<Record<string, unknown>>(
        `/api/v1/vendors?${qs.toString()}`,
        { timeoutMs: 60_000 },
      )
      const list = normaliseVendorList(raw, limit)
      // Dev only: pad a thin directory with invented vendors that match the filters.
      if (MOCKS_ENABLED && list.vendors.length < MOCK_FILL) {
        const { mockVendors } = await import('./mocks')
        const extra = mockVendors().filter(
          (v) =>
            (!p.category || v.category === p.category) &&
            (!p.city || v.city === p.city),
        )
        return { ...list, vendors: [...list.vendors, ...extra].slice(0, limit) }
      }
      return list
    },
    staleTime: 60 * 1000,
    retry: false,
  })
}

/** One vendor's public page. A missing vendor is an `ApiError` 404. */
export const vendorQuery = (id: string) =>
  queryOptions({
    queryKey: ['vendors', 'profile', id],
    queryFn: async (): Promise<VendorProfile> => {
      try {
        const raw = await apiGet<Record<string, unknown>>(
          `/api/v1/vendors/${encodeURIComponent(id)}`,
          { timeoutMs: 60_000 },
        )
        return normaliseVendorProfile(raw)
      } catch (err) {
        // Dev only: an invented vendor from the padded directory.
        if (MOCKS_ENABLED) {
          const { mockVendorProfile } = await import('./mocks')
          const mock = mockVendorProfile(id)
          if (mock) return mock
        }
        throw err
      }
    },
    staleTime: 60 * 1000,
    retry: false,
  })
