import { CTA } from '#/lib/cta'
import { portalUrl } from '#/features/vendors/portal'

/** A closing call to action that leads into the portal. Defaults are the vendors copy. */
export function ClosingCta({
  heading = 'Ready to get booked?',
  body = 'Create your profile, then apply to the callouts that fit.',
  label = 'Create your profile',
  path = '/register',
}: {
  heading?: string
  body?: string
  label?: string
  path?: string
}) {
  return (
    <section
      aria-label={label}
      className="relative isolate mt-20 overflow-hidden rounded-3xl bg-ink p-7 text-white sm:p-10 lg:p-12"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_10%,rgba(51,137,99,0.42),transparent_40%),linear-gradient(115deg,#0c2018_0%,#164632_60%,#10453f_100%)]"
      />
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-100/75 uppercase">
            Your next step
          </p>
          <h2 className="mt-3 max-w-xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-3 max-w-lg text-white/75">{body}</p>
        </div>
        <a href={portalUrl(path)} className={`${CTA.onDark} shrink-0`}>
          {label}
        </a>
      </div>
    </section>
  )
}
