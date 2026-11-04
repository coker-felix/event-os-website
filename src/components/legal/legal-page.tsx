import { Link } from '@tanstack/react-router'
import { CTA } from '#/lib/cta'
import { Reveal } from '#/components/motion/reveal'
import { AUDIENCES, draftNoticeVisible, filterSections } from '#/lib/legal'
import type { Audience, LegalDoc } from '#/content/legal/types'

const OTHER_DOCS = [
  { slug: 'terms', label: 'Terms of use' },
  { slug: 'privacy', label: 'Privacy policy' },
  { slug: 'cookies', label: 'Cookies' },
] as const

const chip = (on: boolean) => (on ? CTA.chipOn : CTA.chipOff)

/** One legal document, filterable by who is reading. */
export function LegalPage({
  doc,
  audience,
  onAudience,
}: {
  doc: LegalDoc
  audience: Exclude<Audience, 'all'> | undefined
  onAudience: (a: Exclude<Audience, 'all'> | undefined) => void
}) {
  const sections = filterSections(doc, audience)
  const showDraft = draftNoticeVisible(import.meta.env.VITE_LEGAL_REVIEWED)

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold">{doc.title}</h1>

      {showDraft && (
        <p
          role="note"
          className="mt-4 rounded-xl border border-flame/40 bg-secondary p-4 text-sm"
        >
          <strong>Draft, pending legal review.</strong> This page is written
          from what Event OS does today. Parts marked "To confirm" are still
          being decided and are not final.
        </p>
      )}

      <p className="mt-4 text-lg text-mist">{doc.intro}</p>

      <div
        role="group"
        aria-label="Who is reading"
        className="mt-6 flex flex-wrap gap-2"
      >
        <button
          type="button"
          aria-pressed={!audience}
          className={chip(!audience)}
          onClick={() => onAudience(undefined)}
        >
          All
        </button>
        {AUDIENCES.map((a) => (
          <button
            key={a.id}
            type="button"
            aria-pressed={audience === a.id}
            className={chip(audience === a.id)}
            onClick={() => onAudience(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>

      <nav aria-label="On this page" className="mt-8">
        <ol className="grid gap-1 text-sm sm:grid-cols-2">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-violet-ink underline underline-offset-2">
                {s.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-10">
        {sections.map((s) => (
          <Reveal key={s.id}>
            <section id={s.id} aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`} className="text-2xl font-bold">
                {s.heading}
              </h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          </Reveal>
        ))}
      </div>

      <p className="mt-12 flex flex-wrap gap-x-4 border-t border-line pt-6 text-sm">
        {OTHER_DOCS.filter((d) => d.slug !== doc.slug).map((d) => (
          <Link
            key={d.slug}
            to={`/${d.slug}`}
            className="text-violet-ink underline underline-offset-2"
          >
            {d.label}
          </Link>
        ))}
        <Link to="/contact" className="text-violet-ink underline underline-offset-2">
          Contact us
        </Link>
      </p>
    </article>
  )
}
