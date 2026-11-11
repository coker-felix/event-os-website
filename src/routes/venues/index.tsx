import { createFileRoute } from '@tanstack/react-router'
import { Reveal } from '#/components/motion/reveal'
import { FaqSection, faqJsonLd } from '#/components/landing/faq-section'
import { ClosingCta } from '#/components/vendors/closing-cta'
import { ComingSoon } from '#/components/vendors/coming-soon'
import { HowToStart } from '#/components/vendors/how-to-start'
import { Audiences } from '#/components/venues/audiences'
import { VenueBenefits } from '#/components/venues/venue-benefits'
import { VenueHero } from '#/components/venues/venue-hero'
import { VenueStrip } from '#/components/venues/venue-strip'
import { VenueOperations } from '#/components/venues/venue-operations'
import { VENUE_FAQS } from '#/content/venue-faqs'
import { COMING_SOON, HERO, HOW_TO_START } from '#/content/venue-landing'
import { venueDirectoryQuery } from '#/features/venues/queries'
import { ProductShowcase } from '#/components/landing/product-showcase'
import { Testimonials } from '#/components/landing/testimonials'

export const Route = createFileRoute('/venues/')({
  // Warm the cache on the server. A failing API must never fail the page.
  loader: async ({ context: { queryClient } }) => {
    await Promise.allSettled([
      queryClient.ensureQueryData(venueDirectoryQuery({ page: 1 })),
    ])
  },
  head: () => ({
    meta: [
      { title: `${HERO.headline} | EventRail for Venues` },
      { name: 'description', content: HERO.subline },
    ],
    scripts: [
      { type: 'application/ld+json', children: faqJsonLd(VENUE_FAQS) },
    ],
  }),
  component: VenueLanding,
})

function VenueLanding() {
  return (
    <div>
      <VenueHero />
      <Reveal>
        <VenueStrip />
      </Reveal>
      <Reveal>
        <Audiences />
      </Reveal>
      <Reveal>
        <VenueOperations />
      </Reveal>
      <Reveal>
        <VenueBenefits />
      </Reveal>
      <Reveal>
        <ProductShowcase product="venues" />
      </Reveal>
      <Reveal>
        <ComingSoon items={COMING_SOON} />
      </Reveal>
      <Reveal>
        <HowToStart steps={HOW_TO_START} />
      </Reveal>
      <Reveal>
        <FaqSection faqs={VENUE_FAQS} />
      </Reveal>
      <Reveal>
        <ClosingCta
          heading="Ready to bring your venue operations together?"
          body="Use the venue portal for bookings, internal events and seat charts. Publish a directory listing whenever you want to receive EventRail booking requests."
          label="Set up your venue"
          path="/register"
        />
      </Reveal>
      <Reveal>
        <Testimonials audience="venues" showSamples />
      </Reveal>
    </div>
  )
}
