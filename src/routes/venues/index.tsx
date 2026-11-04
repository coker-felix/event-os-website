import { createFileRoute } from '@tanstack/react-router'
import { FaqSection, faqJsonLd } from '#/components/landing/faq-section'
import { ClosingCta } from '#/components/vendors/closing-cta'
import { ComingSoon } from '#/components/vendors/coming-soon'
import { HowToStart } from '#/components/vendors/how-to-start'
import { Audiences } from '#/components/venues/audiences'
import { VenueBenefits } from '#/components/venues/venue-benefits'
import { VenueHero } from '#/components/venues/venue-hero'
import { VenueStrip } from '#/components/venues/venue-strip'
import { VENUE_FAQS } from '#/content/venue-faqs'
import { COMING_SOON, HERO, HOW_TO_START } from '#/content/venue-landing'
import { venueDirectoryQuery } from '#/features/venues/queries'

export const Route = createFileRoute('/venues/')({
  // Warm the cache on the server. A failing API must never fail the page.
  loader: async ({ context: { queryClient } }) => {
    await Promise.allSettled([
      queryClient.ensureQueryData(venueDirectoryQuery({ page: 1 })),
    ])
  },
  head: () => ({
    meta: [
      { title: `${HERO.headline} | Event OS for Venues` },
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
      <VenueStrip />
      <Audiences />
      <VenueBenefits />
      <ComingSoon items={COMING_SOON} />
      <HowToStart steps={HOW_TO_START} />
      <FaqSection faqs={VENUE_FAQS} />
      <ClosingCta
        heading="Ready to fill your calendar?"
        body="List your venue, get reviewed, and start receiving booking requests."
        label="List your venue"
        path="/register"
      />
    </div>
  )
}
