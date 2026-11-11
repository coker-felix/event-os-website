import { OrganizerAvatar } from '#/components/organizers/organizer-avatar'
import { TESTIMONIALS } from '#/content/testimonials'
import { MOCK_TESTIMONIALS } from '#/features/mocks/testimonials'
import { visibleTestimonials } from '#/features/testimonials/visible'
import type { TestimonialAudience } from '#/features/testimonials/visible'
import { MOCKS_ENABLED } from '#/lib/mocks'

const HEADING: Record<TestimonialAudience, string> = {
  organizers: 'What organizers say',
  vendors: 'What vendors say',
  venues: 'What venue teams say',
  attendees: 'What attendees say',
}

/**
 * Quotes from people who work with EventRail. The list is static
 * (`src/content/testimonials.ts`); with none for this audience the section is
 * hidden. In dev, invented placeholders stand in so the design can be seen.
 */
export function Testimonials({ audience, showSamples = false }: { audience: TestimonialAudience; showSamples?: boolean }) {
  const real = visibleTestimonials(TESTIMONIALS, audience)
  const items =
    real.length > 0 ? real : (MOCKS_ENABLED || showSamples) ? visibleTestimonials(MOCK_TESTIMONIALS, audience) : []
  if (items.length === 0) return null
  return (
    <section aria-labelledby={`testimonials-${audience}`} className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 id={`testimonials-${audience}`} className="text-2xl font-bold">
          {HEADING[audience]}
        </h2>
        {real.length === 0 && showSamples && <span className="text-xs text-mist">Sample testimonials</span>}
      </div>
      <ul className="mt-4 grid gap-4 md:grid-cols-3">
        {items.map((t) => (
          <li key={t.quote}>
            <figure className="flex h-full flex-col justify-between rounded-2xl border border-line bg-card p-6">
              <blockquote className="leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <OrganizerAvatar name={t.name} logoUrl={t.photo} size="sm" />
                <span className="min-w-0 text-sm">
                  <span className="block font-semibold">{t.name}</span>
                  <span className="block text-mist">
                    {[t.role, t.company].filter(Boolean).join(', ')}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
