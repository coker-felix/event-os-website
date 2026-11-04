import { Link } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'

// A real sequence, so the numbers carry meaning.
const STEPS = [
  {
    title: 'Pick an event',
    body: 'Browse by date, place or category and open the one you like.',
  },
  {
    title: 'Pay securely',
    body: 'Choose your tickets, add your contact details and check out.',
  },
  {
    title: 'Get your ticket',
    body: 'Your ticket is tied to your contact details, ready for the door.',
  },
]

export function HowItWorks() {
  return (
    <section aria-label="How it works" className="mt-16">
      <h2 className="text-2xl font-bold">How it works</h2>
      <ol className="mt-4 grid gap-4 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="rounded-2xl border border-line bg-card p-5"
          >
            <span className="grid size-8 place-items-center rounded-full bg-violet text-sm font-bold text-white">
              {i + 1}
            </span>
            <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
            <p className="mt-1 text-sm text-mist">{s.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-mist">
        <ShieldCheck className="size-5 text-violet" aria-hidden />
        Payments are handled securely through Paystack.
        <Link
          to="/tickets/help"
          className="font-semibold text-violet hover:underline"
        >
          Lost a ticket? Find it here.
        </Link>
      </p>
    </section>
  )
}
