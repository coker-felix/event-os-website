import { Link } from '@tanstack/react-router'
import { HelpCircle, ReceiptText, Ticket } from 'lucide-react'

const CARD =
  'lift-card group flex min-h-28 flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-card p-4 font-semibold sm:p-5'

/** Self-help first: many questions are already answered elsewhere. */
export function QuickAnswers() {
  return (
    <section aria-label="Quick answers">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-violet-ink uppercase">
            Start here
          </p>
          <h2 className="mt-1 text-2xl font-bold">Need a quick answer?</h2>
        </div>
        <p className="text-sm text-mist">Skip the wait for common questions.</p>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        <li>
          <Link to="/tickets/help" className={CARD}>
            <Ticket className="size-5 text-violet-ink" aria-hidden />
            <span className="flex w-full items-center justify-between gap-2">
              Find my tickets{' '}
              <span aria-hidden className="motion-arrow text-violet-ink">
                →
              </span>
            </span>
          </Link>
        </li>
        <li>
          <Link to="/" hash="faqs" className={CARD}>
            <HelpCircle className="size-5 text-violet-ink" aria-hidden />
            <span className="flex w-full items-center justify-between gap-2">
              Read the FAQs{' '}
              <span aria-hidden className="motion-arrow text-violet-ink">
                →
              </span>
            </span>
          </Link>
        </li>
        <li>
          <Link to="/" hash="faqs" className={CARD}>
            <ReceiptText className="size-5 text-violet-ink" aria-hidden />
            <span className="flex w-full items-center justify-between gap-2">
              Refunds and orders{' '}
              <span aria-hidden className="motion-arrow text-violet-ink">
                →
              </span>
            </span>
          </Link>
        </li>
      </ul>
    </section>
  )
}
