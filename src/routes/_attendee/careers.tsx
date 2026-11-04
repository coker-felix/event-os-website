import { Link, createFileRoute } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import { CompanyNav } from '#/components/company/company-nav'
import { Reveal } from '#/components/motion/reveal'
import { COMPANY } from '#/content/company'
import { getJobs } from '#/features/company/data'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/_attendee/careers')({
  head: () => ({
    meta: [
      { title: 'Careers | Event OS' },
      { name: 'description', content: 'Open roles at Event OS.' },
    ],
  }),
  component: CareersPage,
})

function CareersPage() {
  const jobs = getJobs()
  return (
    <div className="mx-auto max-w-4xl">
      <CompanyNav />
      <h1 className="text-4xl font-extrabold">Careers</h1>
      {jobs.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-card p-6">
          <p className="font-semibold">There are no open roles right now.</p>
          <p className="mt-1 text-sm text-mist">
            If you'd like to work with us anyway, tell us what you do.
          </p>
          {COMPANY.email ? (
            <a href={`mailto:${COMPANY.email}`} className={`${CTA.primary} mt-4`}>
              Email us
            </a>
          ) : (
            <Link to="/contact" className={`${CTA.primary} mt-4`}>
              Contact us
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="mt-3 max-w-2xl text-lg text-mist">Help us run better events.</p>
          <ul className="mt-8 divide-y divide-line rounded-2xl border border-line bg-card">
            {jobs.map((j, i) => (
              <Reveal as="li" key={`${j.title}-${j.location}`} delayIndex={i}>
                <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold">{j.title}</h2>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-mist">
                      <span>{j.team}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" aria-hidden />
                        {j.location}
                      </span>
                      <span>{j.type}</span>
                    </p>
                  </div>
                  <a href={j.apply} className={`${CTA.outline} shrink-0`}>
                    Apply
                    <span className="sr-only"> for {j.title}</span>
                  </a>
                </div>
              </Reveal>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
