import { Mail, MessageCircle, Phone } from 'lucide-react'
import { mailtoLink, telLink, whatsappLink } from '#/features/contact/config'
import { SUPPORT_HOURS } from '#/features/contact/hours'
import type { SiteConfig } from '#/features/contact/config'
import { CTA } from '#/lib/cta'

const BUTTON =
  `${CTA.outline}`

/**
 * WhatsApp, phone and email as one-tap buttons. A channel with no number or
 * address is simply not shown, so a missing config never leaves a dead button.
 */
export function ReachUs({
  config,
  status,
  variant = 'light',
}: {
  config: SiteConfig | undefined
  status: { open: boolean; label: string } | null
  variant?: 'light' | 'dark'
}) {
  const whatsapp = whatsappLink(config?.supportWhatsapp ?? config?.supportPhone)
  const phone = telLink(config?.supportPhone)
  const email = mailtoLink(config?.supportEmail)
  const hasAny = whatsapp ?? phone ?? email
  const dark = variant === 'dark'
  const buttonClass = dark
    ? 'inline-flex min-h-11 items-center gap-2 rounded-sm border border-white/25 px-3.5 text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10'
    : BUTTON
  const muted = dark ? 'text-white/70' : 'text-mist'

  return (
    <section
      aria-label="Contact support directly"
      className={dark ? 'rounded-2xl bg-ink p-6 text-white sm:p-7' : 'rounded-2xl border border-line bg-card p-5'}
    >
      <p className={`text-xs font-semibold tracking-[0.14em] uppercase ${dark ? 'text-white/60' : 'text-mist'}`}>
        Support desk
      </p>
      <h2 className="mt-2 text-2xl leading-tight font-bold">Prefer to speak to a person?</h2>
      <p className={`mt-2 text-sm ${muted}`}>
        Choose the channel that works for you. We’ll pick up from there.
      </p>
      {hasAny ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={buttonClass}>
              <MessageCircle className={`size-4 ${dark ? 'text-[#efc76e]' : 'text-violet-ink'}`} aria-hidden />
              WhatsApp
            </a>
          )}
          {phone && (
            <a href={phone} className={buttonClass}>
              <Phone className={`size-4 ${dark ? 'text-[#efc76e]' : 'text-violet-ink'}`} aria-hidden />
              Call
            </a>
          )}
          {email && (
            <a href={email} className={buttonClass}>
              <Mail className={`size-4 ${dark ? 'text-[#efc76e]' : 'text-violet-ink'}`} aria-hidden />
              Email
            </a>
          )}
        </div>
      ) : (
        <p className={`mt-5 text-sm ${muted}`}>
          Use the form and we'll get back to you.
        </p>
      )}
      <div className={`mt-6 border-t pt-4 ${dark ? 'border-white/15' : 'border-line'}`}>
        <p className={`text-xs font-semibold tracking-wide uppercase ${muted}`}>Support hours</p>
        <p className="mt-1 text-sm font-medium">
          Mon to Fri, 9 AM to 6 PM ({SUPPORT_HOURS.timeZone.split('/')[1]} time)
        </p>
        <p role="status" className={`mt-2 text-sm font-semibold ${status?.open ? (dark ? 'text-[#83d0ba]' : 'text-violet-ink') : muted}`}>
          {status?.label ?? 'Checking support hours…'}
        </p>
      </div>
    </section>
  )
}
