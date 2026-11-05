import type { LegalDoc } from './types'

/** Draft, written from what the product does. See terms.ts. */
export const PRIVACY: LegalDoc = {
  slug: 'privacy',
  title: 'Privacy policy',
  intro:
    'This policy explains what EventRail collects, why, and what you can do about it. It is written for attendees, vendors, event organizers and venue owners. We do not run analytics, tracking or advertising on this site.',
  sections: [
    {
      id: 'who-we-are',
      audience: 'all',
      heading: 'Who is responsible',
      body: [
        'EventRail is run by [To confirm: company name and registered address].',
        'Privacy questions: use the contact page or write to [To confirm: privacy contact email].',
      ],
    },
    {
      id: 'attendees-collect',
      audience: 'attendees',
      heading: 'What we collect when you buy tickets',
      body: [
        'Your phone number and email, and whether we send tickets by SMS or email.',
        'Your order: the event, the tickets, the amount, and your billing country where it is needed.',
        'Your answers to any questions the event asks at checkout.',
        'Any support message you send us through the contact page, and the contact details you give with it.',
        'Your details if you join a waitlist or sign up for event alerts.',
      ],
    },
    {
      id: 'attendees-use',
      audience: 'attendees',
      heading: 'How we use it',
      body: [
        'To take your order, send your tickets, tell you about changes to an event you booked, and answer your messages.',
        'We use your alert sign-up only to send the alerts you asked for.',
      ],
    },
    {
      id: 'vendors-collect',
      audience: 'vendors',
      heading: 'What we collect from vendors',
      body: [
        'Your vendor profile: your name, services, pictures and contact details you choose to show.',
        'KYC documents you provide in the portal, so we can verify your identity and business before payouts.',
        'Ratings and reviews about you, which are public on your vendor page.',
      ],
    },
    {
      id: 'organizers-collect',
      audience: 'organizers',
      heading: 'What we collect from event organizers',
      body: [
        'Your account details and the information you put on your events.',
        'Orders for your events. [To confirm: which attendee details an organizer can see, and why]',
      ],
    },
    {
      id: 'venues-collect',
      audience: 'venues',
      heading: 'What we collect from venue owners',
      body: [
        'Your venue profile and the booking requests you receive and answer.',
        'Dates you hold. These show publicly as unavailable, without personal details.',
      ],
    },
    {
      id: 'payments',
      audience: 'all',
      heading: 'Payments',
      body: [
        'You enter card details on a page run by Paystack. We do not receive or store your card number.',
      ],
    },
    {
      id: 'sharing',
      audience: 'all',
      heading: 'Who we share it with',
      body: [
        'Paystack, to take payments. The services we use to send SMS and email, so your tickets reach you. [To confirm: full list of service providers]',
        'We do not sell your details.',
      ],
    },
    {
      id: 'storage',
      audience: 'all',
      heading: 'Browser storage',
      body: [
        'We keep a few things in your browser. The Cookies page lists each one, why we keep it, and how to remove it.',
      ],
    },
    {
      id: 'keeping',
      audience: 'all',
      heading: 'How long we keep it',
      body: ['[To confirm: how long orders, support messages, profiles and KYC documents are kept]'],
    },
    {
      id: 'rights',
      audience: 'all',
      heading: 'Your choices and rights',
      body: [
        'You can ask to see, correct or delete your details. [To confirm: rights wording for your jurisdiction and how to make a request]',
        '[To confirm: minimum age for using the site]',
      ],
    },
  ],
}
