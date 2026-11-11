import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ProfileCard } from '#/components/community/profile-card'
import { CommunityUnavailable } from '#/components/community/community-unavailable'
import { COMMUNITY_PAGE_SIZE, profilesQuery, skillsQuery, statusQuery } from '#/features/community/queries'
import { communityLinks } from '#/features/community/links'
import { validatePeopleSearch } from '#/features/community/people-search'
import type { PeopleSearch } from '#/features/community/people-search'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/community/people/')({
  validateSearch: (raw: Record<string, unknown>) => validatePeopleSearch(raw),
  loader: async ({ context: { queryClient } }) => {
    await Promise.allSettled([queryClient.ensureQueryData(statusQuery())])
  },
  head: () => ({
    meta: [
      { title: 'People | EventRail Community' },
      { name: 'description', content: 'Meet event organizers and professionals in the EventRail community.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: PeoplePage,
})

function PeoplePage() {
  const rawSearch = Route.useSearch()
  const search = useMemo(() => validatePeopleSearch(rawSearch as Record<string, unknown>), [rawSearch])
  const navigate = Route.useNavigate()
  const status = useQuery(statusQuery())
  const enabled = status.data?.blueprints === true
  const page = search.page ?? 1
  const filters = { q: search.q, skill: search.skill, country: search.country, city: search.city, availability: search.availability, limit: COMMUNITY_PAGE_SIZE, offset: (page - 1) * COMMUNITY_PAGE_SIZE }
  const profiles = useQuery({ ...profilesQuery(filters), enabled })
  const skills = useQuery({ ...skillsQuery(), enabled })
  const skillNames = useMemo(() => new Map((skills.data ?? []).map((skill) => [skill.id, skill.name])), [skills.data])
  const setSearch = (next: PeopleSearch) => void navigate({ search: next, replace: true })
  const filtered = !!(search.q || search.skill || search.country || search.city || search.availability)

  if (status.isPending) return <p className="text-mist" role="status">Loading community…</p>
  if (status.isError) return <CommunityUnavailable onRetry={() => void status.refetch()} />
  if (!status.data.blueprints) return <section className="rounded-2xl border border-line bg-card p-6"><h1 className="text-2xl font-bold">Community is coming soon</h1><p className="mt-2 text-mist">We’re getting the community ready. Check back soon.</p></section>

  const rows = profiles.data?.profiles ?? []
  return (
    <div>
      <h1 className="text-3xl font-bold">People</h1>
      <p className="mt-1 max-w-2xl text-mist">Meet the people who plan and make events happen.</p>

      <form className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); setSearch({ ...search, q: String(data.get('q') ?? '').trim() || undefined, country: String(data.get('country') ?? '').trim() || undefined, city: String(data.get('city') ?? '').trim() || undefined, page: undefined }) }}>
        <label className="sm:col-span-2">
          <span className="sr-only">Search people</span>
          <input name="q" defaultValue={search.q ?? ''} placeholder="Search people" className="min-h-11 w-full rounded-sm border border-line bg-card px-3 text-sm" />
        </label>
        <label>
          <span className="sr-only">Skill</span>
          <select aria-label="Skill" value={search.skill ?? ''} onChange={(event) => setSearch({ ...search, skill: event.target.value || undefined, page: undefined })} className={CTA.select}>
            <option value="">All skills</option>
            {(skills.data ?? []).map((skill) => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Availability</span>
          <select aria-label="Availability" value={search.availability ?? ''} onChange={(event) => setSearch({ ...search, availability: (event.target.value || undefined) as PeopleSearch['availability'], page: undefined })} className={CTA.select}>
            <option value="">Any availability</option>
            <option value="unspecified">Not specified</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Country code</span>
          <input aria-label="Country code" name="country" defaultValue={search.country ?? ''} maxLength={2} placeholder="Country (e.g. GH)" className="min-h-11 w-full rounded-sm border border-line bg-card px-3 text-sm" />
        </label>
        <label>
          <span className="sr-only">City</span>
          <input aria-label="City" name="city" defaultValue={search.city ?? ''} placeholder="City" className="min-h-11 w-full rounded-sm border border-line bg-card px-3 text-sm" />
        </label>
        <button type="submit" className={CTA.outline}>Search</button>
      </form>

      {profiles.isPending ? <p className="mt-8 text-mist" role="status">Loading people…</p> : profiles.isError ? (
        <div className="mt-8 rounded-2xl border border-line bg-card p-6" role="alert">
          <h2 className="text-xl font-bold">We can’t load the directory right now</h2>
          <p className="mt-1 text-mist">Try again in a minute.</p>
          <button type="button" onClick={() => void profiles.refetch()} className={`${CTA.primary} mt-4`}>Try again</button>
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-card p-6">
          {filtered ? <><h2 className="text-xl font-bold">No matches</h2><p className="mt-1 text-mist">No people match these filters.</p><button type="button" onClick={() => setSearch({})} className={`${CTA.primary} mt-4`}>Clear filters</button></> : <><h2 className="text-xl font-bold">No people listed yet</h2><p className="mt-1 text-mist">Be one of the first to join the community.</p><a href={communityLinks.join()} className={`${CTA.primary} mt-4`}>Join the community</a></>}
        </div>
      ) : (
        <>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((profile) => <li key={profile.userId}><ProfileCard profile={profile} skills={profile.skillIds.map((id) => skillNames.get(id)).filter((name): name is string => !!name)} /></li>)}
          </ul>
          {profiles.data.hasMore && <div className="mt-8 text-center"><button type="button" onClick={() => setSearch({ ...search, page: page + 1 })} className={CTA.outline}>Load more people</button></div>}
          {page > 1 && <div className="mt-3 text-center"><button type="button" onClick={() => setSearch({ ...search, page: page - 1 === 1 ? undefined : page - 1 })} className="min-h-11 px-4 text-sm font-semibold hover:underline">Previous page</button></div>}
        </>
      )}
    </div>
  )
}
