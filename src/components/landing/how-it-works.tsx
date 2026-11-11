import { Link } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'

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
    <section
      id="how-it-works"
      aria-label="How it works"
      className="relative left-1/2 mt-20 w-screen -translate-x-1/2 overflow-hidden border-y border-foreground/10 bg-[#eee8da] px-4 py-16 scroll-mt-24 sm:px-6 lg:mt-24 lg:px-8 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            Three steps
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-foreground/10 bg-background/70 p-4 text-sm text-mist">
            <ShieldCheck
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden
            />
            <p>
              Payments are handled securely through Paystack.{' '}
              <Link
                to="/tickets/help"
                className="font-semibold text-foreground underline decoration-primary/40 underline-offset-4 hover:text-primary"
              >
                Lost a ticket? Find it here.
              </Link>
            </p>
          </div>
        </div>
        <ol className="divide-y divide-foreground/10 overflow-hidden rounded-3xl border border-foreground/10 bg-card lg:col-span-8">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#1f3d2f] text-sm font-semibold text-[#f6f1e7]">
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-md text-mist">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
