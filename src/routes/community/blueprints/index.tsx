import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { BlueprintCard } from '#/components/community/blueprint-card'
import { CommunityUnavailable } from '#/components/community/community-unavailable'
import { COMMUNITY_PAGE_SIZE, blueprintsQuery, statusQuery } from '#/features/community/queries'
import { validateBlueprintsSearch } from '#/features/community/search'
import { communityLinks } from '#/features/community/links'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/community/blueprints/')({
  validateSearch: (raw: Record<string, unknown>) => validateBlueprintsSearch(raw),
  loaderDeps: ({ search }) => ({ ...search }),
  loader: async ({ context: { queryClient }, deps }) => {
    const settled = await Promise.allSettled([queryClient.ensureQueryData(statusQuery())])
    const status = settled[0]
    if (status.status === 'fulfilled' && status.value.blueprints) {
      await Promise.allSettled([queryClient.ensureQueryData(blueprintsQuery({
        q: deps.q, tag: deps.tag, author: deps.author, sort: deps.sort ?? 'forks',
        limit: COMMUNITY_PAGE_SIZE, offset: ((deps.page ?? 1) - 1) * COMMUNITY_PAGE_SIZE,
      }))])
    }
  },
  headers: () => ({ 'Cache-Control': 'public, max-age=60' }),
  head: () => ({ meta: [
    { title: 'Blueprints | EventRail Community' },
    { name: 'description', content: 'Browse event playbooks shared by people who have run them.' },
  ] }),
  component: BlueprintsPage,
})

function BlueprintsPage() {
  const rawSearch = Route.useSearch()
  const search = useMemo(() => validateBlueprintsSearch(rawSearch as Record<string, unknown>), [rawSearch])
  const navigate = Route.useNavigate()
  const status = useQuery(statusQuery())
  const enabled = status.data?.blueprints === true
  const list = useQuery({
    ...blueprintsQuery({ q: search.q, tag: search.tag, author: search.author, sort: search.sort ?? 'forks',
      limit: COMMUNITY_PAGE_SIZE, offset: ((search.page ?? 1) - 1) * COMMUNITY_PAGE_SIZE }),
    enabled,
  })
  const items = list.data?.blueprints ?? []
  const filtered = !!search.q || !!search.tag || !!search.author
  const tags = [...new Set(items.flatMap((blueprint) => blueprint.tags))]
  const authorName = items.find((blueprint) => blueprint.authorUserId === search.author)?.authorName
  const set = (next: { q?: string; tag?: string; author?: string; sort?: 'forks' | 'recent' }) =>
    void navigate({ search: next, replace: true })

  if (status.isPending) return <p role="status" className="text-muted-foreground">Loading community…</p>
  if (status.isError) return <CommunityUnavailable onRetry={() => void status.refetch()} />
  if (!enabled) return <section className="rounded-2xl border border-line bg-card p-6"><h1 className="text-2xl font-bold">Community is coming soon</h1><p className="mt-2 text-muted-foreground">Get notified when community blueprints are available.</p><a className={`${CTA.primary} mt-4`} href="/contact">Get notified</a></section>

  return <div>
    <h1 className="text-3xl font-bold">Blueprint library</h1>
    <p className="mt-1 max-w-2xl text-muted-foreground">Practical event plans shared by people who have run them.</p>
    <form className="mt-6 flex flex-wrap items-end gap-3" onSubmit={(event) => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)
      set({ q: String(data.get('q') ?? '').trim() || undefined, tag: search.tag, author: search.author, sort: search.sort })
    }}>
      <label className="grid gap-1 text-sm font-medium">Search blueprints<input name="q" defaultValue={search.q ?? ''} className="h-11 min-w-64 rounded-sm border border-line bg-card px-3" /></label>
      <label className="grid gap-1 text-sm font-medium">Sort<select aria-label="Sort blueprints" value={search.sort ?? 'forks'} onChange={(event) => set({ ...search, sort: event.target.value as 'forks' | 'recent' })} className={CTA.select}><option value="forks">Most used</option><option value="recent">Newest</option></select></label>
      <button className={CTA.outline} type="submit">Search</button>
      {search.tag && <button className={CTA.chipOff} type="button" onClick={() => set({ ...search, tag: undefined })}>Tag: {search.tag} ×</button>}
      {search.author && <button className={CTA.chipOff} type="button" onClick={() => set({ ...search, author: undefined })}>By {authorName || 'author'} ×</button>}
    </form>
    {tags.length > 0 && <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter by tag">{tags.map((tag) => <button key={tag} type="button" aria-pressed={search.tag === tag} className={search.tag === tag ? CTA.chipOn : CTA.chipOff} onClick={() => set({ ...search, tag: search.tag === tag ? undefined : tag })}>{tag}</button>)}</div>}

    {list.isPending ? <p className="mt-8 text-muted-foreground" role="status">Loading blueprints…</p> : list.isError ? <CommunityUnavailable onRetry={() => void list.refetch()} /> : items.length === 0 ? <section className="mt-8 rounded-2xl border border-line bg-card p-6">
      {filtered ? <><h2 className="text-xl font-bold">No matches</h2><p className="mt-1 text-muted-foreground">Clear filters to see all blueprints.</p><button type="button" className={`${CTA.primary} mt-4`} onClick={() => set({ sort: search.sort })}>Clear filters</button></> : <><h2 className="text-xl font-bold">No blueprints yet</h2><p className="mt-1 text-muted-foreground">Be one of the first to share one.</p><a href={communityLinks.join()} className={`${CTA.primary} mt-4`}>Join the community</a></>}
    </section> : <>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((blueprint) => <li key={blueprint.id}><BlueprintCard blueprint={blueprint} /></li>)}</ul>
      {list.data.hasMore && <div className="mt-8 text-center"><button className={CTA.outline} type="button" onClick={() => void navigate({ search: { ...search, page: (search.page ?? 1) + 1 }, replace: true })}>Load more blueprints</button></div>}
    </>}
  </div>
}
