import { Mail, MessageCircle, Phone } from 'lucide-react'
import { mailtoLink, telLink, whatsappLink } from '#/features/contact/config'
import { SUPPORT_HOURS } from '#/features/contact/hours'
import type { SiteConfig } from '#/features/contact/config'

const BUTTON =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-card px-5 font-semibold hover:border-ink'

/**
 * WhatsApp, phone and email as one-tap buttons. A channel with no number or
 * address is simply not shown, so a missing config never leaves a dead button.
 */
export function ReachUs({
  config,
  status,
}: {
  config: SiteConfig | undefined
  status: { open: boolean; label: string } | null
}) {
  const whatsapp = whatsappLink(config?.supportWhatsapp ?? config?.supportPhone)
  const phone = telLink(config?.supportPhone)
  const email = mailtoLink(config?.supportEmail)
  const hasAny = whatsapp ?? phone ?? email

  return (
    <section
      aria-label="Other ways to reach us"
      className="rounded-2xl border border-line bg-card p-5"
    >
      <h2 className="text-lg font-bold">Other ways to reach us</h2>
      {hasAny ? (
        <div className="mt-3 flex flex-wrap gap-3">
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={BUTTON}>
              <MessageCircle className="size-4 text-violet" aria-hidden />
              WhatsApp
            </a>
          )}
          {phone && (
            <a href={phone} className={BUTTON}>
              <Phone className="size-4 text-violet" aria-hidden />
              Call
            </a>
          )}
          {email && (
            <a href={email} className={BUTTON}>
              <Mail className="size-4 text-violet" aria-hidden />
              Email
            </a>
          )}
        </div>
      ) : (
        <p className="mt-2 text-sm text-mist">
          Use the form and we'll get back to you.
        </p>
      )}
      <p className="mt-4 text-sm text-mist">
        Mon to Fri, 9 AM to 6 PM ({SUPPORT_HOURS.timeZone.split('/')[1]} time)
      </p>
      {status && (
        <p
          role="status"
          className={`mt-1 text-sm font-semibold ${status.open ? 'text-violet' : ''}`}
        >
          {status.label}
        </p>
      )}
    </section>
  )
}
