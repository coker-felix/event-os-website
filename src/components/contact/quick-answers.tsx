import { Link } from '@tanstack/react-router'
import { HelpCircle, ReceiptText, Ticket } from 'lucide-react'

const CARD =
  'flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3 font-semibold hover:border-ink'

/** Self-help first: many questions are already answered elsewhere. */
export function QuickAnswers() {
  return (
    <section
      aria-label="Quick answers"
      className="rounded-2xl border-2 border-violet bg-secondary p-5"
    >
      <h2 className="text-lg font-bold">Need a quick answer first?</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-3">
        <li>
          <Link to="/tickets/help" className={CARD}>
            <Ticket className="size-5 text-violet" aria-hidden />
            Find my tickets
          </Link>
        </li>
        <li>
          <Link to="/" hash="faqs" className={CARD}>
            <HelpCircle className="size-5 text-violet" aria-hidden />
            Read the FAQs
          </Link>
        </li>
        <li>
          <Link to="/" hash="faqs" className={CARD}>
            <ReceiptText className="size-5 text-violet" aria-hidden />
            Refunds and orders
          </Link>
        </li>
      </ul>
    </section>
  )
}
