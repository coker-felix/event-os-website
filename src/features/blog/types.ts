/**
 * Proposed contract for the blog endpoints (not yet implemented in the
 * backend; see docs/specs/website-landing-api.md section 4):
 * `GET /api/v1/blog/posts` and `GET /api/v1/blog/posts/{slug}`.
 * Newest first, published only.
 */
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt?: string
  coverImageUrl?: string
  category?: string
  author?: string
  /** Unix seconds. */
  publishedAt?: number
  readMinutes?: number
}

export interface BlogPostsResponse {
  posts: Array<BlogPost>
  total?: number
}

/** A full post. `body` is plain text, paragraphs separated by blank lines. */
export type BlogArticle = BlogPost & { body: string }

export interface BlogList {
  posts: Array<BlogPost>
  hasMore: boolean
}
