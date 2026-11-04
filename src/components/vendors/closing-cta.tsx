import { portalUrl } from '#/features/vendors/portal'

export function ClosingCta() {
  return (
    <section
      aria-label="Create your profile"
      className="mt-16 rounded-3xl bg-violet p-6 text-white sm:p-10"
    >
      <h2 className="max-w-xl text-3xl leading-tight font-extrabold">
        Ready to get booked?
      </h2>
      <p className="mt-2 max-w-md text-white/80">
        Create your profile, then apply to the callouts that fit.
      </p>
      <a
        href={portalUrl('/register')}
        className="mt-6 inline-flex h-12 items-center rounded-full bg-white px-6 font-semibold text-ink hover:bg-white/90"
      >
        Create your profile
      </a>
    </section>
  )
}
