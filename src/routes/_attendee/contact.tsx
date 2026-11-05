import { useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ContactForm } from '#/components/contact/contact-form'
import { NotAnAttendee } from '#/components/contact/not-an-attendee'
import { QuickAnswers } from '#/components/contact/quick-answers'
import { ReachUs } from '#/components/contact/reach-us'
import { siteConfigQuery } from '#/features/contact/config'
import { supportStatus } from '#/features/contact/hours'
import type { ContactTopic } from '#/features/contact/form'

export const Route = createFileRoute('/_attendee/contact')({
  // Warm the cache on the server. A failing API must never fail the page.
  loader: async ({ context: { queryClient } }) => {
    await Promise.allSettled([queryClient.ensureQueryData(siteConfigQuery)])
  },
  head: () => ({
    meta: [
      { title: 'Contact us | EventRail' },
      {
        name: 'description',
        content:
          'Get help with tickets, orders and refunds, or reach us about vendors, venues and organizing events.',
      },
    ],
  }),
  component: ContactPage,
})

function ContactPage() {
  const config = useQuery(siteConfigQuery)
  const [topic, setTopic] = useState<ContactTopic | ''>('')
  const formRef = useRef<HTMLElement>(null)

  // Time-dependent, so it is worked out in the browser after mount: the
  // server and the first client render then match.
  const [status, setStatus] = useState<ReturnType<typeof supportStatus> | null>(
    null,
  )
  useEffect(() => {
    const update = () => setStatus(supportStatus(new Date()))
    update()
    const id = window.setInterval(update, 60_000)
    return () => window.clearInterval(id)
  }, [])

  function chooseOrganizer() {
    setTopic('organizer')
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth'
    formRef.current?.scrollIntoView({ behavior })
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 border-b border-line pb-7 sm:mb-10 sm:pb-9">
        <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
          EventRail support
        </p>
        <h1 className="mt-2 max-w-2xl text-4xl leading-[1.04] font-extrabold sm:text-5xl">
          Let’s get this sorted.
        </h1>
        <p className="mt-3 max-w-xl text-lg text-mist">
          Tell us what happened. We usually reply within one working day.
        </p>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-7">
        <aside className="space-y-5">
          <ReachUs config={config.data} status={status} variant="dark" />
          <NotAnAttendee onOrganizer={chooseOrganizer} />
        </aside>
        <ContactForm topic={topic} onTopicChange={setTopic} formRef={formRef} />
      </div>

      <div className="mt-10 border-t border-line pt-7 sm:mt-12 sm:pt-9">
        <QuickAnswers />
      </div>
    </div>
  )
}
