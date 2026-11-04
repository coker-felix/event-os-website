import { createFileRoute } from '@tanstack/react-router'
import { Benefits } from '#/components/vendors/benefits'
import { CalloutStrip } from '#/components/vendors/callout-strip'
import { ClosingCta } from '#/components/vendors/closing-cta'
import { ComingSoon } from '#/components/vendors/coming-soon'
import { HowToStart } from '#/components/vendors/how-to-start'
import { Scenarios } from '#/components/vendors/scenarios'
import { VendorHero } from '#/components/vendors/vendor-hero'
import { FaqSection, faqJsonLd } from '#/components/landing/faq-section'
import { VENDOR_FAQS } from '#/content/vendor-faqs'
import { HERO } from '#/content/vendor-landing'
import { eventsQuery } from '#/features/events/queries'
import { calloutsQuery } from '#/features/vendors/queries'

export const Route = createFileRoute('/vendors/')({
  // Warm the cache on the server. A failing API must never fail the page.
  loader: async ({ context: { queryClient } }) => {
    await Promise.allSettled([
      queryClient.ensureQueryData(calloutsQuery({ page: 1 })),
      queryClient.ensureQueryData(eventsQuery),
    ])
  },
  head: () => ({
    meta: [
      { title: `${HERO.headline} | Event OS for Vendors` },
      { name: 'description', content: HERO.subline },
    ],
    scripts: [
      { type: 'application/ld+json', children: faqJsonLd(VENDOR_FAQS) },
    ],
  }),
  component: VendorLanding,
})

function VendorLanding() {
  return (
    <div>
      <VendorHero />
      <CalloutStrip />
      <Scenarios />
      <Benefits />
      <ComingSoon />
      <HowToStart />
      <FaqSection faqs={VENDOR_FAQS} />
      <ClosingCta />
    </div>
  )
}
