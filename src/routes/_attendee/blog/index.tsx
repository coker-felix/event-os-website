import { useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { CategoryChips } from '#/components/blog/category-chips'
import { FeaturedPost } from '#/components/blog/featured-post'
import { PostCard } from '#/components/blog/post-card'
import { postsQuery } from '#/features/blog/queries'
import { categoriesOfPosts, splitFeatured } from '#/features/blog/utils'
import { Reveal } from '#/components/motion/reveal'
import { CTA } from '#/lib/cta'

interface BlogSearch {
  category?: string
  page?: number
}

export const Route = createFileRoute('/_attendee/blog/')({
  validateSearch: (s: Record<string, unknown>): BlogSearch => {
    const category =
      typeof s.category === 'string' && s.category.trim()
        ? s.category.trim()
        : undefined
    const page = Number(s.page)
    return {
      category,
      page: Number.isInteger(page) && page > 1 ? page : undefined,
    }
  },
  loaderDeps: ({ search }) => ({ category: search.category, page: search.page ?? 1 }),
  // Warm the cache on the server. A failing API must never fail the page.
  loader: async ({ context: { queryClient }, deps }) => {
    await Promise.allSettled([
      queryClient.ensureQueryData(postsQuery({ page: 1 })),
      queryClient.ensureQueryData(postsQuery(deps)),
    ])
  },
  head: () => ({
    meta: [
      { title: 'Blog | Event OS' },
      {
        name: 'description',
        content:
          'Guides for attendees, tips for vendors and venues, and news from Event OS.',
      },
    ],
  }),
  component: BlogPage,
})

function BlogPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const page = search.page ?? 1

  // The unfiltered first page gives the category chips; the other query is
  // the list being shown. With no filter they are the same query.
  const all = useQuery(postsQuery({ page: 1 }))
  const list = useQuery(postsQuery({ category: search.category, page }))

  const setCategory = useCallback(
    (category: string | undefined) =>
      void navigate({ search: { category }, replace: true }),
    [navigate],
  )

  const { featured, rest } = splitFeatured(list.data?.posts ?? [])
  const categories = categoriesOfPosts(all.data?.posts ?? [])

  return (
    <div>
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="mt-1 text-mist">
        Guides for attendees, tips for vendors and venues, and news.
      </p>

      {list.isPending ? (
        <p className="mt-8 text-mist" role="status">
          Loading posts…
        </p>
      ) : list.isError ? (
        <div className="mt-8 rounded-2xl border border-line bg-card p-6" role="alert">
          <h2 className="text-xl font-bold">We couldn't load the blog</h2>
          <p className="mt-1 text-mist">Check your connection, then try again.</p>
          <button
            type="button"
            onClick={() => list.refetch()}
            className={`${CTA.primary} mt-4`}
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {featured && (
            <div className="mt-6">
              <FeaturedPost post={featured} />
            </div>
          )}

          <div className="mt-6">
            <CategoryChips
              categories={categories}
              active={search.category}
              onSelect={setCategory}
            />
          </div>

          {featured ? (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p, i) => (
                <Reveal as="li" key={p.id} delayIndex={i}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-mist">
              No posts yet. Check back soon for guides and news.
            </p>
          )}

          {list.data.hasMore && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() =>
                  void navigate({
                    search: { category: search.category, page: page + 1 },
                    replace: true,
                  })
                }
                className={CTA.outline}
              >
                Load more posts
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
