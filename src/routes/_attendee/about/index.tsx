import { Link, createFileRoute } from '@tanstack/react-router'
import { CompanyNav } from '#/components/company/company-nav'
import { Reveal } from '#/components/motion/reveal'
import { ABOUT, COMPANY } from '#/content/company'
import { getTeam } from '#/features/company/data'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/_attendee/about/')({
  head: () => ({
    meta: [
      { title: 'About us | Event OS' },
      { name: 'description', content: ABOUT.intro },
    ],
  }),
  component: AboutPage,
})

function AboutPage() {
  const facts = [
    COMPANY.founded ? ['Founded', String(COMPANY.founded)] : null,
    COMPANY.location ? ['Based in', COMPANY.location] : null,
  ].filter((f): f is [string, string] => f !== null)
  const hasTeam = getTeam().length > 0

  return (
    <div className="mx-auto max-w-4xl">
      <CompanyNav />
      <p className="text-xs font-semibold tracking-[0.18em] text-mist uppercase">{ABOUT.eyebrow}</p>
      <h1 className="mt-3 max-w-2xl text-4xl leading-[1.05] font-extrabold sm:text-5xl">
        {ABOUT.headline}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-mist">{ABOUT.intro}</p>

      <Reveal>
        <section aria-label="What we do" className="mt-14">
          <h2 className="text-2xl font-bold">What we do</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {ABOUT.products.map((p) => (
              <li key={p.name}>
                <Link
                  to={p.to}
                  className="block h-full rounded-2xl border border-line bg-card p-5 transition-colors hover:border-foreground"
                >
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="mt-1 text-sm text-mist">{p.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal>
        <section aria-label="Why Event OS" className="mt-14">
          <h2 className="text-2xl font-bold">Why Event OS</h2>
          {ABOUT.why.map((p) => (
            <p key={p} className="mt-3 max-w-2xl leading-relaxed">
              {p}
            </p>
          ))}
        </section>
      </Reveal>

      {facts.length > 0 && (
        <Reveal>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm text-mist">{k}</dt>
                <dd className="font-display text-2xl font-extrabold">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )}

      <Reveal>
        <section aria-label="Get in touch" className="mt-14 rounded-2xl bg-ink p-6 text-white sm:p-10">
          <h2 className="max-w-xl text-2xl leading-tight font-extrabold">
            Questions, ideas or want to work with us?
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/contact" className={CTA.onDark}>
              Contact us
            </Link>
            {hasTeam && (
              <Link to="/about/team" className={CTA.outlineOnDark}>
                Meet the team
              </Link>
            )}
          </div>
        </section>
      </Reveal>
    </div>
  )
}
