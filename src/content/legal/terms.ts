import type { LegalDoc } from './types'

/**
 * Draft, written from what the product does. Business and legal decisions are
 * `[To confirm: ...]` placeholders for the owner and their lawyer.
 */
export const TERMS: LegalDoc = {
  slug: 'terms',
  title: 'Terms of use',
  intro:
    'These terms explain how you may use EventRail to find events, buy tickets, offer services, list venues and run events. They are written for four groups: attendees, vendors, event organizers and venue owners. Pick yours, or read all of it.',
  sections: [
    {
      id: 'who-we-are',
      audience: 'all',
      heading: 'Who we are',
      body: [
        'EventRail is run by [To confirm: company name and registered address].',
        'By using the site you agree to these terms. If you do not agree, please do not use it.',
      ],
    },
    {
      id: 'using-the-site',
      audience: 'all',
      heading: 'Using the site',
      body: [
        'Give accurate information, keep to the law, and do not misuse the site or try to break it.',
        'We may change or pause parts of the site. Features marked "Coming soon" are not available yet and are not part of these terms.',
      ],
    },
    {
      id: 'payments',
      audience: 'all',
      heading: 'Payments',
      body: [
        'Card payments are taken on a page run by Paystack. Paystack handles your card details, and its own terms apply to the payment.',
      ],
    },
    {
      id: 'attendees-buying',
      audience: 'attendees',
      heading: 'Buying tickets',
      body: [
        'You choose tickets, give a phone number, an email or both, and pay. Your tickets are sent to the contact details you gave, by SMS or email, as you chose.',
        'Check the event details and your contact details before you pay. A cart is held for a short time while you check out [To confirm: how long a cart is held], then it expires.',
      ],
    },
    {
      id: 'attendees-refunds',
      audience: 'attendees',
      heading: 'Refunds and cancellations',
      body: [
        '[To confirm: refund and cancellation rules, and who decides them: the organizer or EventRail]',
        'If you have a problem with an order, use the contact page and tell us the order and the contact details you used.',
      ],
    },
    {
      id: 'attendees-age',
      audience: 'attendees',
      heading: 'Who can buy',
      body: ['[To confirm: minimum age to buy tickets]'],
    },
    {
      id: 'vendors-profile',
      audience: 'vendors',
      heading: 'Vendor profiles and callouts',
      body: [
        'You create and manage your vendor profile in the portal. Keep it accurate and up to date. You may apply to callouts that organizers publish.',
        'We do not promise you bookings or income. We may review, hide or remove a profile that is misleading or breaks these terms.',
      ],
    },
    {
      id: 'vendors-payouts',
      audience: 'vendors',
      heading: 'Verification and payouts',
      body: [
        'Payouts to vendors for callout bookings are held until KYC (identity and business verification) is complete.',
        '[To confirm: payout timing and method after KYC clears]',
      ],
    },
    {
      id: 'vendors-ratings',
      audience: 'vendors',
      heading: 'Ratings',
      body: [
        'Ratings and reviews of vendors are shown publicly on vendor pages.',
      ],
    },
    {
      id: 'organizers-events',
      audience: 'organizers',
      heading: 'Creating and running events',
      body: [
        'You are responsible for the information on your event page, for the event itself, and for any permits it needs.',
        'Ticket money is held and released to you after the event [To confirm: holdback period and payout schedule].',
      ],
    },
    {
      id: 'organizers-booking',
      audience: 'organizers',
      heading: 'Booking venues and vendors',
      body: [
        'Asking to book a venue sends a request. The venue owner can accept or decline it. Agreements for a booking are between you and the venue owner or the vendor.',
      ],
    },
    {
      id: 'venues-listing',
      audience: 'venues',
      heading: 'Venue listings and booking requests',
      body: [
        'You manage your venue listing in the portal and keep it accurate. A venue can be bookable, where organizers send requests, or listing-only.',
        'You accept or decline each request. Agreements for a booking are between you and the organizer.',
      ],
    },
    {
      id: 'venues-calendar',
      audience: 'venues',
      heading: 'Your calendar',
      body: [
        'Dates you hold appear publicly as unavailable, without personal details. Keep your calendar current so organizers are not misled.',
      ],
    },
    {
      id: 'liability',
      audience: 'all',
      heading: 'Our responsibility',
      body: [
        '[To confirm: liability wording, to be written by your lawyer]',
        'Events, vendors and venues are run by the people who list them, not by EventRail.',
      ],
    },
    {
      id: 'law-and-contact',
      audience: 'all',
      heading: 'Governing law and contact',
      body: [
        '[To confirm: governing law and which courts apply]',
        'Questions about these terms: use the contact page or write to [To confirm: legal contact email].',
      ],
    },
  ],
}
