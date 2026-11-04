import { queryOptions } from '@tanstack/react-query'
import { apiGet } from '#/lib/api'
import { MOCKS_ENABLED } from '#/lib/mocks'
import { mockPosts } from '#/features/mocks/posts'
import type { BlogList, BlogPost, BlogPostsResponse } from './types'

const FEATURED_COUNT = 3
export const BLOG_PAGE_SIZE = 12

function valid(posts: Array<BlogPost>): Array<BlogPost> {
  return posts.filter((p) => p.id && p.slug && p.title)
}

export const featuredPostsQuery = queryOptions({
  queryKey: ['blog', 'featured', FEATURED_COUNT],
  queryFn: async () => {
    try {
      const res = await apiGet<BlogPostsResponse>(
        `/api/v1/blog/posts?featured=true&limit=${FEATURED_COUNT}`,
        { timeoutMs: 4000 },
      )
      return valid(res.posts).slice(0, FEATURED_COUNT)
    } catch (err) {
      // The endpoint does not exist yet: show invented posts in dev only.
      if (MOCKS_ENABLED) return mockPosts().slice(0, FEATURED_COUNT)
      throw err
    }
  },
  staleTime: 5 * 60 * 1000,
  retry: false,
})

/**
 * Posts for the blog list. "Load more" asks for a longer first page
 * (`limit` grows with `page`), so there is no cursor to keep.
 */
export const postsQuery = (params: { category?: string; page: number }) => {
  const limit = BLOG_PAGE_SIZE * Math.max(1, params.page)
  return queryOptions({
    queryKey: ['blog', 'posts', params.category ?? '', limit],
    queryFn: async (): Promise<BlogList> => {
      const qs = new URLSearchParams({ limit: String(limit), offset: '0' })
      if (params.category) qs.set('category', params.category)
      try {
        const res = await apiGet<BlogPostsResponse>(
          `/api/v1/blog/posts?${qs.toString()}`,
          { timeoutMs: 4000 },
        )
        const posts = valid(res.posts)
        const hasMore =
          typeof res.total === 'number' ? res.total > posts.length : posts.length >= limit
        return { posts, hasMore }
      } catch (err) {
        if (!MOCKS_ENABLED) throw err
        const all = mockPosts().filter(
          (p) => !params.category || p.category === params.category,
        )
        return { posts: all.slice(0, limit), hasMore: all.length > limit }
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}
