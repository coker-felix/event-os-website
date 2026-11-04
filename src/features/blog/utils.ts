import type { BlogPost } from './types'

/** Each category once, in the order it first appears. */
export function categoriesOfPosts(posts: Array<BlogPost>): Array<string> {
  const seen = new Set<string>()
  for (const p of posts) if (p.category) seen.add(p.category)
  return [...seen]
}

/** The first post leads the page; the rest fill the grid. */
export function splitFeatured(posts: Array<BlogPost>): {
  featured: BlogPost | undefined
  rest: Array<BlogPost>
} {
  const [featured, ...rest] = posts
  return { featured, rest }
}
