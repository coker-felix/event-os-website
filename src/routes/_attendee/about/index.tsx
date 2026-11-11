import { ArrowUpRight } from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CompanyNav } from '#/components/company/company-nav'
import { Reveal } from '#/components/motion/reveal'
import { ABOUT, COMPANY } from '#/content/company'
import { getTeam } from '#/features/company/data'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/_attendee/about/')({
  head: () => ({
    meta: [
      { title: 'About Us | EventRail' },
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
    <div className="mx-auto max-w-6xl">
      <CompanyNav />

      <section className="full-bleed mt-0 bg-ink text-white">
        <div className="mx-auto grid min-h-[30rem] max-w-6xl items-center gap-10 px-4 py-12 sm:py-16 lg:min-h-[min(70vh,36rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/65 uppercase">
              {ABOUT.eyebrow}
            </p>
            <h1 className="mt-4 text-5xl leading-[0.98] font-extrabold tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              {ABOUT.headline}
              <span className="mt-2 block text-[#F7F3EB]">
                {ABOUT.headlineContinuation}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
              {ABOUT.intro}
            </p>
            <a
              href="#ecosystem"
              className="mt-7 inline-flex min-h-11 items-center gap-2 font-semibold text-white hover:text-[#F7F3EB]"
            >
              See who EventRail brings together
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>

          <div className="border border-white/20 bg-white/[0.04] p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-white/15 pb-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-white/55 uppercase">
                  The event rail
                </p>
                <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                  One event, from find to front gate.
                </h2>
              </div>
              <span
                className="mt-1 size-2 shrink-0 rounded-full bg-[#F7F3EB]"
                aria-hidden
              />
            </div>
            <ol className="mt-1">
              {ABOUT.journey.map((step, i) => (
                <li
                  key={step.stage}
                  className="grid grid-cols-[2rem_1fr] gap-3 border-b border-white/10 py-4 last:border-0"
                >
                  <span className="pt-0.5 font-display text-sm font-bold tabular-nums text-[#F7F3EB]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-semibold">{step.stage}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/65">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <Reveal>
        <section
          id="ecosystem"
          aria-label="Who EventRail serves"
          className="mt-16 scroll-mt-24 sm:mt-20"
        >
          <div className="grid gap-4 border-b border-line pb-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
                One event system
              </p>
              <h2 className="mt-2 max-w-md text-3xl leading-tight font-bold sm:text-4xl">
                Different roles. Shared momentum.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              {ABOUT.why[0]}
            </p>
          </div>
          <ul className="mt-1 grid gap-x-10 md:grid-cols-2">
            {ABOUT.products.map((p) => (
              <li key={p.name}>
                <Link
                  to={p.to}
                  className="group grid h-full grid-cols-[minmax(5.5rem,0.45fr)_1fr_auto] items-center gap-3 border-b border-line py-5 transition-colors hover:bg-secondary/45 focus-visible:bg-secondary/45 sm:gap-5 sm:py-6"
                >
                  <span className="text-xs font-semibold tracking-wide text-violet-ink uppercase">
                    {p.name.replace('For ', '')}
                  </span>
                  <span>
                    <span className="block text-lg font-bold">{p.name}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-mist">
                      {p.body}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-4 text-mist transition-colors group-hover:text-violet-ink"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {facts.length > 0 && (
        <Reveal>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-b border-line pb-7">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-semibold tracking-wide text-mist uppercase">
                  {label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )}

      <Reveal>
        <section
          aria-label="How EventRail works across channels"
          className="mt-16 grid gap-6 border-y border-line py-8 sm:mt-20 sm:py-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14"
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
              Reach beyond one screen
            </p>
            <h2 className="mt-2 max-w-md text-3xl leading-tight font-bold sm:text-4xl">
              The same event, across the channels people use.
            </h2>
          </div>
          <div>
            <p className="max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              {ABOUT.why[1]}
            </p>
            <ul
              aria-label="EventRail channels"
              className="mt-5 flex flex-wrap gap-2"
            >
              {ABOUT.channels.map((channel) => (
                <li
                  key={channel}
                  className="rounded-sm border border-line px-3 py-1.5 text-sm font-medium"
                >
                  {channel}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section
          aria-label="Why EventRail"
          className="mt-16 grid gap-6 sm:mt-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14"
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
              Why EventRail
            </p>
            <h2 className="mt-2 max-w-md text-3xl leading-tight font-bold sm:text-4xl">
              Make the work around the event work together.
            </h2>
          </div>
          <dl className="divide-y divide-line border-y border-line">
            {ABOUT.principles.map((principle) => (
              <div
                key={principle.title}
                className="grid gap-2 py-5 sm:grid-cols-[0.75fr_1fr] sm:gap-6 sm:py-6"
              >
                <dt className="text-lg font-bold">{principle.title}</dt>
                <dd className="text-sm leading-relaxed text-mist sm:text-base">
                  {principle.body}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </Reveal>

      <Reveal>
        <section
          aria-label="Get in touch"
          className="mt-16 flex flex-col gap-6 rounded-2xl bg-ink p-6 text-white sm:mt-20 sm:flex-row sm:items-end sm:justify-between sm:p-9"
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
              Keep the conversation going
            </p>
            <h2 className="mt-2 max-w-xl text-3xl leading-tight font-extrabold sm:text-4xl">
              Building an event? Let’s talk about what you need.
            </h2>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
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
