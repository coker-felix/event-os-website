import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { toDate } from '#/features/events/format'
import type { BlogPost } from '#/features/blog/types'

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

/** "3 Nov 2026 · 4 min read", or whatever of that is known. */
export function postMeta(post: BlogPost): string {
  const published = toDate(post.publishedAt)
  return [
    published ? dateFmt.format(published) : null,
    post.readMinutes ? `${post.readMinutes} min read` : null,
  ]
    .filter(Boolean)
    .join(' · ')
}

export function PostCard({ post }: { post: BlogPost }) {
  const [imageFailed, setImageFailed] = useState(false)
  const meta = postMeta(post)
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition-shadow hover:shadow-lg focus-visible:shadow-lg"
    >
      <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-violet to-ink">
        {post.coverImageUrl && !imageFailed && (
          <img
            src={post.coverImageUrl}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {post.category && (
          <p className="text-xs font-semibold tracking-[0.14em] text-violet uppercase">
            {post.category}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 text-lg leading-snug font-bold group-hover:underline">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm text-mist">{post.excerpt}</p>
        )}
        {meta && <p className="mt-auto pt-4 text-xs text-mist">{meta}</p>}
      </div>
    </Link>
  )
}
