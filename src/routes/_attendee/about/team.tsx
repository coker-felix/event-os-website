import { Link, createFileRoute } from '@tanstack/react-router'
import { CompanyNav } from '#/components/company/company-nav'
import { TeamCard } from '#/components/company/team-card'
import { Reveal } from '#/components/motion/reveal'
import { getTeam } from '#/features/company/data'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/_attendee/about/team')({
  head: () => ({
    meta: [
      { title: 'Our team | Event OS' },
      { name: 'description', content: 'The people behind Event OS.' },
    ],
  }),
  component: TeamPage,
})

function TeamPage() {
  const team = getTeam()
  return (
    <div className="mx-auto max-w-4xl">
      <CompanyNav />
      <h1 className="text-4xl font-extrabold">Our team</h1>
      <p className="mt-3 max-w-2xl text-lg text-mist">The people behind Event OS.</p>
      {team.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-card p-6">
          <p className="font-semibold">We haven't added our team here yet.</p>
          <Link to="/about" className={`${CTA.outline} mt-4`}>
            Back to About us
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {team.map((m, i) => (
            <Reveal as="li" key={m.name} delayIndex={i}>
              <TeamCard member={m} />
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  )
}
