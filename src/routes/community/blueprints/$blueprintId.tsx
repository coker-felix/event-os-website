import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { CommunityUnavailable } from '#/components/community/community-unavailable'
import { NotAvailable } from '#/components/community/not-available'
import { Timeline } from '#/components/community/timeline'
import { communityLinks } from '#/features/community/links'
import { isUuid } from '#/features/community/ids'
import { blueprintQuery, statusQuery } from '#/features/community/queries'
import { ApiError } from '#/lib/api'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/community/blueprints/$blueprintId')({
  loader: async ({ context: { queryClient }, params }) => {
    if (!isUuid(params.blueprintId)) throw notFound()
    try {
      const status = await queryClient.ensureQueryData(statusQuery())
      if (!status.blueprints) return null
      const detail = await queryClient.ensureQueryData(blueprintQuery(params.blueprintId))
      return { title: detail.blueprint.title, summary: detail.blueprint.summary }
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) throw notFound()
      return null
    }
  },
  headers: () => ({ 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' }),
  notFoundComponent: () => <NotAvailable to="/community/blueprints" label="Back to blueprints" />,
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData?.title ? `${loaderData.title} | EventRail Community` : 'Blueprint | EventRail Community' },
    ...(loaderData ? [{ name: 'description', content: loaderData.summary.slice(0, 160) }] : []),
  ] }),
  component: BlueprintPage,
})

function BlueprintPage() {
  const { blueprintId } = Route.useParams()
  const status = useQuery(statusQuery())
  const enabled = status.data?.blueprints === true
  const detail = useQuery({ ...blueprintQuery(blueprintId), enabled })

  if (status.isPending) return <p role="status" className="text-muted-foreground">Loading community…</p>
  if (status.isError) return <CommunityUnavailable onRetry={() => void status.refetch()} />
  if (!enabled) return <section className="rounded-2xl border border-line bg-card p-6"><h1 className="text-2xl font-bold">Community is coming soon</h1><p className="mt-2 text-muted-foreground">Get notified when community blueprints are available.</p><a className={`${CTA.primary} mt-4`} href="/contact">Get notified</a></section>
  if (detail.isPending) return <p role="status" className="text-muted-foreground">Loading blueprint…</p>
  if (detail.isError) {
    if (detail.error instanceof ApiError && detail.error.status === 404) return <NotAvailable to="/community/blueprints" label="Back to blueprints" />
    return <CommunityUnavailable onRetry={() => void detail.refetch()} />
  }

  const { blueprint, snapshot, tasks } = detail.data
  const formerMember = blueprint.authorLabel === 'Former member'
  return <article className="mx-auto max-w-3xl">
    <Link to="/community/blueprints" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold"><ArrowLeft className="size-4" aria-hidden />Blueprints</Link>
    <div className="mt-2 flex flex-wrap items-center gap-3"><h1 className="text-3xl font-extrabold sm:text-4xl">{blueprint.title}</h1><span className="text-sm text-muted-foreground">Version {snapshot.version || blueprint.currentVersion || 1}</span></div>
    {blueprint.summary && <p className="mt-4 text-lg leading-relaxed">{blueprint.summary}</p>}
    {blueprint.tags.length > 0 && <ul aria-label="Tags" className="mt-4 flex flex-wrap gap-2">{blueprint.tags.map((tag) => <li key={tag} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{tag}</li>)}</ul>}
    <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
      <span>{blueprint.forkCount ?? 0} uses</span>
      {formerMember ? <span>By Former member</span> : blueprint.authorName ? <span>By {blueprint.authorUserId ? <a className="font-medium text-foreground hover:underline" href={`/community/people/${encodeURIComponent(blueprint.authorUserId)}`}>{blueprint.authorName}</a> : blueprint.authorName}</span> : null}
      {blueprint.creditedOrgId && <a className="font-medium text-foreground hover:underline" href={`/organizers/${encodeURIComponent(blueprint.creditedOrgId)}`}>Credited organizer</a>}
    </p>
    <section className="mt-8"><h2 className="text-2xl font-bold">The plan</h2>{tasks.length ? <div className="mt-5"><Timeline tasks={tasks} /></div> : <p className="mt-3 text-muted-foreground">This blueprint has no tasks yet.</p>}</section>
    <section className="mt-10 rounded-2xl border border-line bg-card p-5" aria-label="Use this blueprint">
      <h2 className="text-xl font-bold">Use this blueprint</h2>
      <p className="mt-1 text-muted-foreground">You'll need an organizer workspace. We'll help you set one up.</p>
      <a href={communityLinks.useBlueprint(blueprint.id)} className={`${CTA.primary} mt-4`}>Use this blueprint</a>
    </section>
    <p className="mt-5"><a href={communityLinks.report('blueprint', blueprint.id)} className="min-h-11 inline-flex items-center text-sm font-medium hover:underline">Report blueprint</a></p>
  </article>
}
