import type { Faq } from './faqs'

// Real facts only. Review the wording against product policy before shipping.
export const VENUE_FAQS: Array<Faq> = [
  {
    question: 'Do I need a public listing to use the venue portal?',
    answer:
      'No. You can use the venue workspace for venue operations, internal events, API-connected bookings and seat charts without publishing a public directory listing.',
  },
  {
    question: 'Can I bring in bookings from other platforms or AI tools?',
    answer:
      'Yes. API integrations can bring bookings from other platforms and AI tools into your venue workflow.',
  },
  {
    question: 'Can my venue organization also organize events?',
    answer:
      'Yes. A venue organization can use EventRail organizer capabilities to create and manage its own events.',
  },
  {
    question: 'How do I list my venue?',
    answer:
      "Create a profile in the portal and add your venue's details. Once we have reviewed it, it appears in the directory.",
  },
  {
    question: 'What does "bookable" mean?',
    answer:
      'A bookable venue is managed by its owner and takes booking requests. A listing-only venue is shown for reference and cannot be booked.',
  },
  {
    question: 'Can organizers book my venue?',
    answer:
      'Organizers send a booking request for a date range, and you accept or decline. Accepted dates are blocked on your calendar.',
  },
  {
    question: 'How does the calendar work?',
    answer:
      'Accepted bookings block those dates, so a second booking for the same dates cannot be accepted. Organizers can see the date ranges you hold, but no personal details.',
  },
  {
    question: 'What do I get with a booking?',
    answer:
      'A contract and a draft invoice. When the organizer confirms, the booking is complete, and each completed booking can be rated once.',
  },
  {
    question: 'Can I see how my venue is used?',
    answer: 'Yes. Your portal shows utilization analytics for your venue.',
  },
  {
    question: 'When do I get paid?',
    answer:
      'Payment protection is coming soon. Agree payment terms in your contract.',
  },
]
