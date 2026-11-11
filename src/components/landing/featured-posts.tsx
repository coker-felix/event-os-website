import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { postMeta } from '#/components/blog/post-card'
import type { BlogPost } from '#/features/blog/types'

export function FeaturedPosts({ posts }: { posts: Array<BlogPost> }) {
  if (posts.length === 0) return null
  const [featured, ...rest] = posts.slice(0, 3)
  return (
    <section aria-label="From the blog" className="mt-20 lg:mt-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          From the blog
        </h2>
        <Link
          to="/blog"
          className="text-sm font-semibold underline decoration-primary/40 underline-offset-4 hover:text-primary"
        >
          All posts
        </Link>
      </div>
      <div className="grid gap-5 lg:grid-cols-12">
        {featured && (
          <article className="group overflow-hidden rounded-3xl border border-foreground/10 bg-card lg:col-span-7">
            <PostImage post={featured} className="h-64 sm:h-80" />
            <div className="p-6 sm:p-8">
              {featured.category && (
                <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                  {featured.category}
                </p>
              )}
              <Link
                to="/blog/$slug"
                params={{ slug: featured.slug }}
                className="mt-3 block text-2xl font-semibold leading-snug group-hover:underline"
              >
                {featured.title}
              </Link>
              {featured.excerpt && (
                <p className="mt-2 text-mist">{featured.excerpt}</p>
              )}
              <p className="mt-5 text-xs text-mist">{postMeta(featured)}</p>
            </div>
          </article>
        )}
        <div className="flex flex-col gap-5 lg:col-span-5">
          {rest.map((post) => (
            <article
              key={post.id}
              className="group grid overflow-hidden rounded-3xl border border-foreground/10 bg-card sm:grid-cols-5"
            >
              <PostImage
                post={post}
                className="h-48 sm:col-span-2 sm:h-full sm:min-h-48"
              />
              <div className="p-5 sm:col-span-3">
                {post.category && (
                  <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                    {post.category}
                  </p>
                )}
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="mt-2 block text-lg font-semibold leading-snug group-hover:underline"
                >
                  {post.title}
                </Link>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-mist">
                    {post.excerpt}
                  </p>
                )}
                <p className="mt-4 text-xs text-mist">{postMeta(post)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PostImage({ post, className }: { post: BlogPost; className: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`${className} overflow-hidden bg-secondary`}>
      {post.coverImageUrl && !failed && (
        <img
          src={post.coverImageUrl}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-cover transition duration-700 group-hover:scale-105"
        />
      )}
    </div>
  )
}
