export interface Faq {
  question: string
  answer: string
  link?: { label: string; to: '/tickets/help' | '/contact' | '/vendors' | '/venues' }
}

// Draft copy: review wording on refunds and accounts against product policy.
export const FAQS: Array<Faq> = [
  {
    question: 'How do I buy tickets?',
    answer:
      'Open an event, choose your ticket types and quantities, add your contact details and check out.',
  },
  {
    question: 'Do I need an account to buy?',
    answer:
      'No. You can check out with your contact details and claim an account later using the same phone number or email.',
  },
  {
    question: 'Where do I find my tickets after buying?',
    answer:
      'Your tickets are tied to the contact details you used at checkout. Use ticket self help to find and retrieve them.',
    link: { label: 'Go to ticket self help', to: '/tickets/help' },
  },
  {
    question: 'I lost access to my tickets. What can I do?',
    answer:
      'Ticket self help can recover your tickets using the phone number or email you bought with. If that does not work, contact us.',
    link: { label: 'Get ticket help', to: '/tickets/help' },
  },
  {
    question: 'Can I get a refund?',
    answer:
      'Refund rules are set by each event organizer. Check the event page before you buy, or contact us if something went wrong.',
    link: { label: 'Contact us', to: '/contact' },
  },
  {
    question: 'I sell food, gear or services. How do I get booked at events?',
    answer:
      'Create a vendor profile and respond to open vendor callouts from event organizers.',
    link: { label: 'Explore vendor tools', to: '/vendors' },
  },
  {
    question: 'I own a venue. How do I list it?',
    answer:
      'List your venue to get it seen by event organizers and manage booking requests in one place.',
    link: { label: 'Explore venue tools', to: '/venues' },
  },
]
