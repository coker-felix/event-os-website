import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  CONTACT_TOPICS,
  MAX_MESSAGE,
  submitContact,
  validateContactForm,
} from '#/features/contact/form'
import type { ContactTopic } from '#/features/contact/form'

type Status = 'idle' | 'submitting' | 'sent' | 'error'
type Errors = Partial<Record<'topic' | 'name' | 'contact' | 'message', string>>

const FIELD = 'mt-1 w-full rounded-xl border border-line bg-card px-4 text-base'

export function ContactForm({
  topic,
  onTopicChange,
  formRef,
}: {
  topic: ContactTopic | ''
  onTopicChange: (topic: ContactTopic | '') => void
  formRef?: React.Ref<HTMLElement>
}) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [orderRef, setOrderRef] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [reference, setReference] = useState('')
  const [failure, setFailure] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = validateContactForm({ topic, name, contact, orderRef, message })
    if (!result.ok) {
      setErrors(result.errors)
      setStatus('idle')
      return
    }
    setErrors({})
    setStatus('submitting')
    try {
      const { reference: ref } = await submitContact(result.value)
      setReference(ref)
      setStatus('sent')
    } catch {
      setFailure(
        "We couldn't send your message. Check your connection and try again, or use WhatsApp, phone or email.",
      )
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <section
        ref={formRef}
        aria-label="Message sent"
        className="rounded-2xl border border-line bg-card p-5"
      >
        <h2 className="text-lg font-bold">Message sent</h2>
        <p className="mt-2" role="status">
          We'll reply to the email or phone number you gave us, usually within
          one working day.
          {reference && (
            <>
              {' '}
              Your reference: <strong>#{reference}</strong>.
            </>
          )}
        </p>
        <Link
          to="/events"
          className="mt-4 inline-flex h-12 items-center rounded-full bg-violet px-6 font-semibold text-white"
        >
          Back to events
        </Link>
      </section>
    )
  }

  const error = (id: keyof Errors) =>
    errors[id] ? (
      <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-destructive">
        {errors[id]}
      </p>
    ) : null
  const describe = (id: keyof Errors) => (errors[id] ? `${id}-error` : undefined)

  return (
    <section
      ref={formRef}
      aria-label="Send us a message"
      className="rounded-2xl border border-line bg-card p-5"
    >
      <h2 className="text-lg font-bold">Send us a message</h2>
      <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4">
        <label className="block text-sm font-semibold">
          I'm contacting about
          <select
            value={topic}
            onChange={(e) => onTopicChange(e.target.value as ContactTopic | '')}
            aria-invalid={!!errors.topic}
            aria-describedby={describe('topic')}
            className={`${FIELD} h-12`}
          >
            <option value="">Choose a topic</option>
            {CONTACT_TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        {error('topic')}

        <label className="block text-sm font-semibold">
          Your name
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={describe('name')}
            className={`${FIELD} h-12`}
          />
        </label>
        {error('name')}

        <label className="block text-sm font-semibold">
          Email or phone number
          <input
            type="text"
            inputMode="email"
            autoComplete="email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            aria-invalid={!!errors.contact}
            aria-describedby={describe('contact')}
            className={`${FIELD} h-12`}
          />
        </label>
        {error('contact')}

        <label className="block text-sm font-semibold">
          Order number <span className="font-normal text-mist">(optional)</span>
          <input
            type="text"
            value={orderRef}
            onChange={(e) => setOrderRef(e.target.value)}
            className={`${FIELD} h-12`}
          />
        </label>

        <label className="block text-sm font-semibold">
          How can we help?
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={describe('message')}
            className={`${FIELD} py-3`}
          />
        </label>
        <p className="-mt-2 text-right text-xs text-mist">
          {message.trim().length} / {MAX_MESSAGE}
        </p>
        {error('message')}

        {status === 'error' && (
          <p role="alert" className="text-sm text-destructive">
            {failure}
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="h-12 w-full rounded-full bg-violet text-base font-semibold text-white disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </section>
  )
}
