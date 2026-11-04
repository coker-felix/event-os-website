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
      { title: 'Contact us | Event OS' },
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
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Contact us</h1>
      <p className="mt-1 text-mist">We usually reply within one working day.</p>

      <div className="mt-6">
        <QuickAnswers />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="order-2 lg:order-none lg:row-span-2">
          <ContactForm topic={topic} onTopicChange={setTopic} formRef={formRef} />
        </div>
        <div className="order-1 lg:order-none">
          <ReachUs config={config.data} status={status} />
        </div>
        <div className="order-3 lg:order-none">
          <NotAnAttendee onOrganizer={chooseOrganizer} />
        </div>
      </div>
    </div>
  )
}
