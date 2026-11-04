import { queryOptions } from '@tanstack/react-query'
import { apiGet } from '#/lib/api'
import { MOCKS_ENABLED } from '#/lib/mocks'
import { mockPosts } from '#/features/mocks/posts'
import type { BlogPostsResponse } from './types'

const FEATURED_COUNT = 3

export const featuredPostsQuery = queryOptions({
  queryKey: ['blog', 'featured', FEATURED_COUNT],
  queryFn: async () => {
    try {
      const res = await apiGet<BlogPostsResponse>(
        `/api/v1/blog/posts?featured=true&limit=${FEATURED_COUNT}`,
        { timeoutMs: 4000 },
      )
      return res.posts
        .filter((p) => p.id && p.slug && p.title)
        .slice(0, FEATURED_COUNT)
    } catch (err) {
      // The endpoint does not exist yet: show invented posts in dev only.
      if (MOCKS_ENABLED) return mockPosts()
      throw err
    }
  },
  staleTime: 5 * 60 * 1000,
  retry: false,
})
