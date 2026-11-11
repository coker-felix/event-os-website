import { createFileRoute } from '@tanstack/react-router'
import { FaqSection, faqJsonLd } from '#/components/landing/faq-section'
import {
  OrganizerClosing,
  OrganizerHero,
  OrganizerJourney,
  OrganizerPartnerships,
  OrganizerPartnerServices,
  OrganizerPersonas,
  OrganizerReliability,
  OrganizerSecurity,
} from '#/components/landing/organizer-section'
import { TrustedBy } from '#/components/landing/trusted-by'
import { Reveal } from '#/components/motion/reveal'
import { UpcomingFeature } from '#/components/landing/upcoming-feature'
import { HERO, ORGANIZER_FAQS } from '#/content/organizer-landing'

export const Route = createFileRoute('/organizers/')({
  head: () => ({
    meta: [
      { title: `${HERO.headline} | EventRail for Organizers` },
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
        <OrganizerJourney />
      </Reveal>
      <Reveal>
        <OrganizerReliability />
      </Reveal>
      <Reveal>
        <OrganizerSecurity />
      </Reveal>
      <Reveal>
        <OrganizerPartnerships />
      </Reveal>
      <Reveal>
        <OrganizerPartnerServices />
      </Reveal>
      <Reveal>
        <OrganizerPersonas />
      </Reveal>
      <Reveal>
        <UpcomingFeature audience="organizers" />
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
