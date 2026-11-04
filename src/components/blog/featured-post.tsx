import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { postMeta } from './post-card'
import type { BlogPost } from '#/features/blog/types'

/** The lead story: one large card above the grid. */
export function FeaturedPost({ post }: { post: BlogPost }) {
  const [imageFailed, setImageFailed] = useState(false)
  const meta = postMeta(post)
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group relative isolate block overflow-hidden rounded-3xl bg-ink text-white"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet to-ink" aria-hidden>
        {post.coverImageUrl && !imageFailed && (
          <img
            src={post.coverImageUrl}
            alt=""
            onError={() => setImageFailed(true)}
            className="size-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10" />
      </div>
      <div className="flex min-h-72 flex-col justify-end p-6 sm:min-h-96 sm:p-10">
        {post.category && (
          <p className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">
            {post.category}
          </p>
        )}
        <h2 className="mt-2 max-w-2xl text-3xl leading-tight font-extrabold group-hover:underline sm:text-4xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-3 max-w-xl text-white/80">{post.excerpt}</p>
        )}
        {meta && <p className="mt-4 text-sm text-white/70">{meta}</p>}
      </div>
    </Link>
  )
}
