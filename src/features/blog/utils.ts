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

/** Paragraphs of a plain-text body: split on blank lines, trimmed, no empties. */
export function articleParagraphs(body: string): Array<string> {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

/** Up to `n` other posts: same category first, then the rest in list order. */
export function relatedPosts(
  posts: Array<BlogPost>,
  current: BlogPost,
  n = 3,
): Array<BlogPost> {
  const others = posts.filter((p) => p.id !== current.id)
  const same = others.filter(
    (p) => current.category && p.category === current.category,
  )
  const rest = others.filter((p) => !same.includes(p))
  return [...same, ...rest].slice(0, n)
}

/** Post slugs are lowercase words joined by hyphens (digits allowed). */
export function isPostSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}
