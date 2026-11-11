import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, MapPin } from 'lucide-react'
import { BlueprintCard } from '#/components/community/blueprint-card'
import { CommunityUnavailable } from '#/components/community/community-unavailable'
import { NotAvailable } from '#/components/community/not-available'
import { SkillChips } from '#/components/community/skill-chips'
import { blueprintsQuery, profileQuery, skillsQuery, statusQuery } from '#/features/community/queries'
import { isUuid } from '#/features/community/ids'
import { communityLinks } from '#/features/community/links'
import { ApiError } from '#/lib/api'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/community/people/$userId')({
  loader: async ({ context: { queryClient }, params }) => {
    if (!isUuid(params.userId)) throw notFound()
    const status = await Promise.allSettled([queryClient.ensureQueryData(statusQuery())])
    if (status[0].status !== 'fulfilled' || !status[0].value.blueprints) return null
    try {
      const profile = await queryClient.ensureQueryData(profileQuery(params.userId))
      await Promise.allSettled([
        queryClient.ensureQueryData(blueprintsQuery({ author: params.userId, limit: 6 })),
        queryClient.ensureQueryData(skillsQuery()),
      ])
      return { name: profile.displayName, description: (profile.bio ?? profile.headline ?? `Community profile for ${profile.displayName}.`).slice(0, 160) }
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) throw notFound()
      return null
    }
  },
  notFoundComponent: ProfileNotFound,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} | EventRail Community` : 'Community profile | EventRail' },
      ...(loaderData ? [{ name: 'description', content: loaderData.description }] : []),
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: ProfilePage,
})

function ProfileNotFound() {
  return <NotAvailable to="/community/people" label="Back to people" />
}

function ProfilePage() {
  const { userId } = Route.useParams()
  const status = useQuery(statusQuery())
  const enabled = status.data?.blueprints === true
  const profile = useQuery({ ...profileQuery(userId), enabled })
  const blueprints = useQuery({ ...blueprintsQuery({ author: userId, limit: 6 }), enabled })
  const skills = useQuery({ ...skillsQuery(), enabled })

  if (!isUuid(userId)) return <ProfileNotFound />
  if (status.isPending) return <p className="text-mist" role="status">Loading community…</p>
  if (status.isError) return <CommunityUnavailable onRetry={() => void status.refetch()} />
  if (!status.data.blueprints) return <section className="rounded-2xl border border-line bg-card p-6"><h1 className="text-2xl font-bold">Community is coming soon</h1><p className="mt-2 text-mist">We’re getting the community ready. Check back soon.</p></section>
  if (profile.isPending) return <p className="text-mist" role="status">Loading profile…</p>
  if (profile.isError) {
    if (profile.error instanceof ApiError && profile.error.status === 404) return <ProfileNotFound />
    return <CommunityUnavailable onRetry={() => void profile.refetch()} />
  }

  const person = profile.data
  const skillNames = new Map((skills.data ?? []).map((skill) => [skill.id, skill.name]))
  const location = [person.city, person.country].filter(Boolean).join(', ')
  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/community/people" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold"><ArrowLeft className="size-4" aria-hidden />People</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{person.displayName || 'Community member'}</h1>
          {person.headline && <p className="mt-2 text-lg text-mist">{person.headline}</p>}
          {location && <p className="mt-3 flex items-center gap-1.5 text-sm text-mist"><MapPin className="size-4" aria-hidden />{location}</p>}
          {person.availability && person.availability !== 'unspecified' && <p className="mt-2 text-sm font-medium">{person.availability === 'available' ? 'Available' : 'Unavailable'}</p>}
          {person.badges.includes('founding_member') && <p className="mt-3 w-fit rounded-full bg-secondary px-3 py-1 text-sm font-semibold">Founding member</p>}
        </div>
        <a href={communityLinks.report('profile', userId)} className={CTA.outline}>Report profile</a>
      </div>
      {person.bio && <p className="mt-6 whitespace-pre-line leading-relaxed">{person.bio}</p>}
      <div className="mt-6"><SkillChips skills={person.skillIds.map((id) => skillNames.get(id)).filter((name): name is string => !!name)} /></div>

      <section className="mt-10" aria-labelledby="blueprints-by-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="blueprints-by-heading" className="text-2xl font-bold">Blueprints by {person.displayName || 'this member'}</h2>
          <a href={`/community/blueprints?author=${encodeURIComponent(userId)}`} className="min-h-11 inline-flex items-center font-semibold text-primary hover:underline">See all blueprints</a>
        </div>
        {blueprints.isPending ? <p className="mt-4 text-mist" role="status">Loading blueprints…</p> : blueprints.isError ? <p className="mt-4 text-mist" role="alert">We couldn’t load these blueprints right now.</p> : blueprints.data.blueprints.length === 0 ? <p className="mt-4 text-mist">No public blueprints yet.</p> : <ul className="mt-5 grid gap-4 sm:grid-cols-2">{blueprints.data.blueprints.map((blueprint) => <li key={blueprint.id}><BlueprintCard blueprint={blueprint} /></li>)}</ul>}
      </section>
    </div>
  )
}
