import { Link } from '@tanstack/react-router'
import { PostCard } from '#/components/blog/post-card'
import type { BlogPost } from '#/features/blog/types'

export function FeaturedPosts({ posts }: { posts: Array<BlogPost> }) {
  if (posts.length === 0) return null
  return (
    <section aria-label="From the blog" className="mt-16">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-bold">From the blog</h2>
        <Link
          to="/blog"
          className="text-sm font-semibold text-violet-ink hover:underline"
        >
          All posts
        </Link>
      </div>
      <ul className="grid gap-4 md:grid-cols-3">
        {posts.map((p) => (
          <li key={p.id}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
    </section>
  )
}
