import { Link } from '@tanstack/react-router'
import { TEASER } from '#/content/organizer-landing'
import { CTA } from '#/lib/cta'

/** A slim band on the attendee page for people who host events. */
export function OrganizersTeaser() {
  return (
    <section
      aria-label={TEASER.eyebrow}
      className="mt-16 flex flex-col gap-4 rounded-2xl border border-line bg-card p-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-mist uppercase">
          {TEASER.eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-bold">{TEASER.heading}</h2>
        <p className="mt-1 max-w-xl text-sm text-mist">{TEASER.body}</p>
      </div>
      <Link to="/organizers" className={`${CTA.primary} shrink-0`}>
        {TEASER.cta}
      </Link>
    </section>
  )
}
