import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { BlueprintCard } from '#/components/community/blueprint-card'
import { ComingSoon } from '#/components/community/coming-soon'
import { CommunityUnavailable } from '#/components/community/community-unavailable'
import { ProfileCard } from '#/components/community/profile-card'
import { blueprintsQuery, profilesQuery, statusQuery } from '#/features/community/queries'
import { communityLinks } from '#/features/community/links'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/community/')({
  loader: async ({ context: { queryClient } }) => {
    const [statusResult] = await Promise.allSettled([
      queryClient.ensureQueryData(statusQuery()),
    ])
    if (statusResult.status !== 'fulfilled' || !statusResult.value.blueprints) return

    await Promise.allSettled([
      queryClient.ensureQueryData(blueprintsQuery({ sort: 'forks', limit: 6 })),
      queryClient.ensureQueryData(profilesQuery({ badge: 'founding_member', limit: 12 })),
    ])
  },
  head: () => ({
    meta: [
      { title: 'Community | EventRail' },
      { name: 'description', content: 'Explore event blueprints and meet the people behind them.' },
    ],
  }),
  component: CommunityLanding,
})

function CommunityLanding() {
  const status = useQuery(statusQuery())
  const ready = status.data?.blueprints === true
  const blueprints = useQuery({ ...blueprintsQuery({ sort: 'forks', limit: 6 }), enabled: ready })
  const founders = useQuery({ ...profilesQuery({ badge: 'founding_member', limit: 12 }), enabled: ready })

  if (status.isError) {
    return <CommunityUnavailable onRetry={() => void status.refetch()} />
  }
  if (status.isPending) {
    return <p role="status" className="py-12 text-center text-muted-foreground">Loading the community…</p>
  }
  if (!ready) {
    return <section className="rounded-2xl border border-line bg-card p-6 sm:p-8">
      <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">EventRail Community</p>
      <h1 className="mt-2 text-3xl font-bold">Community is coming soon</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">We’re getting the community ready. Get in touch and we’ll let you know when it opens.</p>
      <Link to="/contact" className={`${CTA.primary} mt-5`}>Get notified</Link>
    </section>
  }
  if (blueprints.isError || founders.isError) {
    return <CommunityUnavailable onRetry={() => {
      void blueprints.refetch()
      void founders.refetch()
    }} />
  }

  return <div>
    <section className="full-bleed bg-ink text-white">
      <div className="mx-auto flex min-h-[22rem] max-w-6xl flex-col justify-center px-4 py-12 sm:min-h-[26rem] sm:py-16">
        <p className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">EventRail Community</p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight font-extrabold sm:text-5xl">Plans that worked, from people who ran them</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/80">Start with practical event blueprints, then meet the organizers and crew who know the work.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="/community/blueprints" className={CTA.onDark}>Explore blueprints</a>
          <a href={communityLinks.join()} className={CTA.outlineOnDark}>Join the community</a>
        </div>
      </div>
    </section>

    <section aria-labelledby="popular-blueprints" className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">Shared by organizers</p>
          <h2 id="popular-blueprints" className="mt-1 text-2xl font-bold">Blueprints people use</h2>
        </div>
        <a href="/community/blueprints" className="inline-flex min-h-11 items-center font-medium text-primary hover:underline">Browse all blueprints</a>
      </div>
      {blueprints.isPending ? <p role="status" className="mt-5 text-muted-foreground">Loading blueprints…</p>
        : blueprints.data.blueprints.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blueprints.data.blueprints.slice(0, 6).map((blueprint) => <BlueprintCard key={blueprint.id} blueprint={blueprint} />)}
        </div> : <div className="mt-5 rounded-2xl border border-line bg-card p-6">
          <h3 className="text-lg font-bold">No blueprints yet. Be one of the first to share one.</h3>
          <p className="mt-2 text-muted-foreground">Join the community and bring a plan that has helped your event run well.</p>
          <a href={communityLinks.join()} className={`${CTA.primary} mt-4`}>Join the community</a>
        </div>}
    </section>

    {!founders.isPending && founders.data.profiles.length ? <section aria-labelledby="founding-members" className="mt-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">The people behind the plans</p>
          <h2 id="founding-members" className="mt-1 text-2xl font-bold">Founding members</h2>
        </div>
        <a href="/community/people" className="inline-flex min-h-11 items-center font-medium text-primary hover:underline">Meet the community</a>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {founders.data.profiles.slice(0, 12).map((profile) => <ProfileCard key={profile.userId} profile={profile} skills={profile.skillIds} />)}
      </div>
    </section> : null}

    <section aria-labelledby="how-it-works" className="mt-14">
      <p className="text-sm font-semibold text-primary">A useful community, built around the work</p>
      <h2 id="how-it-works" className="mt-1 text-2xl font-bold">How it works</h2>
      <ol className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          ['Find a plan', 'Browse playbooks shared by people who have run real events.'],
          ['Make it yours', 'Use a blueprint as the starting point for your organization’s next event.'],
          ['Share what you know', 'Publish a blueprint or create a profile that shows your skills.'],
        ].map(([title, body], index) => <li key={title} className="rounded-2xl border border-line bg-card p-5">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span>
          <h3 className="mt-3 text-lg font-bold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{body}</p>
        </li>)}
      </ol>
    </section>

    <ComingSoon items={[
      { id: 'qa', title: 'Q&A', body: 'Ask questions and learn from other event professionals.' },
      { id: 'crew-call', title: 'Crew Call', body: 'Find event shifts and connect with teams looking for crew.' },
    ]} />

    <section className="mt-12 rounded-2xl bg-primary px-6 py-8 text-primary-foreground sm:px-9 sm:py-10">
      <h2 className="text-2xl font-bold">Bring your experience into the room.</h2>
      <p className="mt-2 max-w-2xl text-primary-foreground/85">Join organizers and event professionals sharing practical plans and skills.</p>
      <a href={communityLinks.join()} className={`${CTA.onDark} mt-5`}>Join the community</a>
    </section>
  </div>
}
