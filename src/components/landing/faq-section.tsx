import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { FAQS } from '#/content/faqs'
import type { Faq } from '#/content/faqs'

/** Native <details>: keyboard accessible and works without JavaScript. */
export function FaqSection({ faqs = FAQS }: { faqs?: Array<Faq> }) {
  return (
    <section
      id="faqs"
      aria-label="Frequently asked questions"
      className="mt-20 scroll-mt-24 lg:mt-24"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <header className="lg:col-span-4">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            Ticket help
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
        </header>
        <div className="divide-y divide-foreground/10 overflow-hidden rounded-3xl border border-foreground/10 bg-card lg:col-span-8">
          {faqs.map((f) => (
            <details key={f.question} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {f.question}
                <Plus
                  className="size-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                />
              </summary>
              <p className="mt-2 max-w-2xl text-mist">{f.answer}</p>
              {f.link && (
                <Link
                  to={f.link.to}
                  className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  {f.link.label}
                </Link>
              )}
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/** FAQPage structured data so search engines can show the answers. */
export function faqJsonLd(faqs: Array<Faq> = FAQS): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }).replace(/</g, '\\u003c')
}
