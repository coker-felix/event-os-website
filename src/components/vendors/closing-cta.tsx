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
      className="mt-16 rounded-3xl bg-violet p-6 text-white sm:p-10"
    >
      <h2 className="max-w-xl text-3xl leading-tight font-extrabold">{heading}</h2>
      <p className="mt-2 max-w-md text-white/80">{body}</p>
      <a
        href={portalUrl(path)}
        className={`mt-6 ${CTA.onDark}`}
      >
        {label}
      </a>
    </section>
  )
}
