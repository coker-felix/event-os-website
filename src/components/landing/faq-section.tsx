import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { FAQS } from '#/content/faqs'

/** Native <details>: keyboard accessible and works without JavaScript. */
export function FaqSection() {
  return (
    <section aria-label="Frequently asked questions" className="mt-16">
      <h2 className="text-2xl font-bold">Questions, answered</h2>
      <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-card">
        {FAQS.map((f) => (
          <details key={f.question} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
              {f.question}
              <Plus
                className="size-5 shrink-0 text-violet transition-transform group-open:rotate-45"
                aria-hidden
              />
            </summary>
            <p className="mt-2 max-w-2xl text-mist">{f.answer}</p>
            {f.link && (
              <Link
                to={f.link.to}
                className="mt-2 inline-block text-sm font-semibold text-violet hover:underline"
              >
                {f.link.label}
              </Link>
            )}
          </details>
        ))}
      </div>
    </section>
  )
}

/** FAQPage structured data so search engines can show the answers. */
export function faqJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }).replace(/</g, '\\u003c')
}
