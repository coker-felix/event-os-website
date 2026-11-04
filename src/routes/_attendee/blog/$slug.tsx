import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { ArticleBody } from '#/components/blog/article-body'
import { HappeningSoon } from '#/components/blog/happening-soon'
import { PostCard, postMeta } from '#/components/blog/post-card'
import { ShareButtons } from '#/components/blog/share-buttons'
import { PartnerStrip } from '#/components/landing/partner-strip'
import { articleQuery, postsQuery } from '#/features/blog/queries'
import { isPostSlug, relatedPosts } from '#/features/blog/utils'
import { categoriesQuery, eventsQuery } from '#/features/events/queries'
import { ApiError } from '#/lib/api'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/_attendee/blog/$slug')({
  // Warm the cache on the server. A missing post is a real 404; any other
  // failure still renders, and the page shows a retry.
  loader: async ({ context: { queryClient }, params }) => {
    if (!isPostSlug(params.slug)) throw notFound()
    try {
      const a = await queryClient.ensureQueryData(articleQuery(params.slug))
      // The related posts and upcoming events below the article.
      await Promise.allSettled([
        queryClient.ensureQueryData(postsQuery({ page: 1 })),
        queryClient.ensureQueryData(eventsQuery),
        queryClient.ensureQueryData(categoriesQuery),
      ])
      return {
        title: a.title,
        description: a.excerpt ?? '',
        image: a.coverImageUrl ?? '',
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound()
      return null
    }
  },
  notFoundComponent: ArticleNotFound,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} | Event OS` : 'Blog | Event OS' },
      ...(loaderData
        ? [
            { name: 'description', content: loaderData.description },
            { property: 'og:title', content: loaderData.title },
            { property: 'og:description', content: loaderData.description },
            { property: 'og:type', content: 'article' },
            ...(loaderData.image
              ? [{ property: 'og:image', content: loaderData.image }]
              : []),
          ]
        : []),
    ],
  }),
  component: ArticlePage,
})

function ArticleNotFound() {
  return (
    <div className="rounded-2xl border border-line bg-card p-6" role="alert">
      <h1 className="text-2xl font-bold">We can't find that post</h1>
      <p className="mt-1 text-mist">It may have been removed or the link is wrong.</p>
      <Link
        to="/blog"
        className={`${CTA.primary} mt-4`}
      >
        Back to the blog
      </Link>
    </div>
  )
}

function ArticlePage() {
  const { slug } = Route.useParams()
  const article = useQuery(articleQuery(slug))
  const posts = useQuery(postsQuery({ page: 1 }))
  const [coverFailed, setCoverFailed] = useState(false)

  if (article.isPending) {
    return (
      <p className="text-mist" role="status">
        Loading post…
      </p>
    )
  }
  if (article.isError) {
    if (article.error instanceof ApiError && article.error.status === 404) {
      return <ArticleNotFound />
    }
    return (
      <div className="rounded-2xl border border-line bg-card p-6" role="alert">
        <h1 className="text-2xl font-bold">We couldn't load this post</h1>
        <p className="mt-1 text-mist">Check your connection, then try again.</p>
        <button
          type="button"
          onClick={() => article.refetch()}
          className={`${CTA.primary} mt-4`}
        >
          Try again
        </button>
      </div>
    )
  }

  const post = article.data
  const meta = [postMeta(post), post.author ? `By ${post.author}` : '']
    .filter(Boolean)
    .join(' · ')
  const related = relatedPosts(posts.data?.posts ?? [], post)

  return (
    <div>
      <article className="mx-auto max-w-[65ch]">
        <Link
          to="/blog"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Blog
        </Link>
        {post.category && (
          <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-violet-ink uppercase">
            {post.category}
          </p>
        )}
        <h1 className="mt-1 text-3xl leading-tight font-extrabold sm:text-4xl">
          {post.title}
        </h1>
        {meta && <p className="mt-3 text-sm text-mist">{meta}</p>}

        <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-violet to-ink">
          {post.coverImageUrl && !coverFailed && (
            <img
              src={post.coverImageUrl}
              alt=""
              onError={() => setCoverFailed(true)}
              className="size-full object-cover"
            />
          )}
        </div>

        <ArticleBody body={post.body} />

        <div className="mt-8 border-t border-line pt-6">
          <ShareButtons title={post.title} />
        </div>
      </article>

      <HappeningSoon />

      {related.length > 0 && (
        <section aria-label="Keep reading" className="mt-14">
          <h2 className="text-2xl font-bold">Keep reading</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.id}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <PartnerStrip />
    </div>
  )
}
