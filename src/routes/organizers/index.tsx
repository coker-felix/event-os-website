import { createFileRoute } from '@tanstack/react-router'
import { FaqSection, faqJsonLd } from '#/components/landing/faq-section'
import {
  OrganizerClosing,
  OrganizerHero,
  OrganizerPersonas,
  OrganizerPillars,
} from '#/components/landing/organizer-section'
import { Testimonials } from '#/components/landing/testimonials'
import { TrustedBy } from '#/components/landing/trusted-by'
import { Reveal } from '#/components/motion/reveal'
import { HowToStart } from '#/components/vendors/how-to-start'
import { HERO, HOW_TO_START, ORGANIZER_FAQS } from '#/content/organizer-landing'

export const Route = createFileRoute('/organizers/')({
  head: () => ({
    meta: [
      { title: `${HERO.headline} | Event OS for Organizers` },
      { name: 'description', content: HERO.subline },
    ],
    scripts: [
      { type: 'application/ld+json', children: faqJsonLd(ORGANIZER_FAQS) },
    ],
  }),
  component: OrganizersLanding,
})

function OrganizersLanding() {
  return (
    <div>
      <OrganizerHero />
      <Reveal>
        <TrustedBy />
      </Reveal>
      <Reveal>
        <OrganizerPillars />
      </Reveal>
      <Reveal>
        <OrganizerPersonas />
      </Reveal>
      <Reveal>
        <div id="start">
          <HowToStart steps={HOW_TO_START} />
        </div>
      </Reveal>
      <Reveal>
        <Testimonials audience="organizers" />
      </Reveal>
      <Reveal>
        <FaqSection faqs={ORGANIZER_FAQS} />
      </Reveal>
      <Reveal>
        <OrganizerClosing />
      </Reveal>
    </div>
  )
}
