/**
 * Proposed contract for `GET /api/v1/blog/posts?featured=true&limit=3`
 * (not yet implemented in the backend). Newest first, published only.
 */
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt?: string
  coverImageUrl?: string
  category?: string
  /** Unix seconds. */
  publishedAt?: number
  readMinutes?: number
}

export interface BlogPostsResponse {
  posts: Array<BlogPost>
}
