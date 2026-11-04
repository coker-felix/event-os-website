import { Link, useRouterState } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { showBannerOn } from '#/lib/consent'
import { useConsent } from '#/stores/consent'

/** Non-blocking bar, shown only until the visitor makes a choice. */
export function ConsentBanner() {
  const status = useConsent((s) => s.status)
  const accept = useConsent((s) => s.accept)
  const decline = useConsent((s) => s.decline)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  // 'loading' on the server and first client render, so markup matches.
  if (status !== 'none' || !showBannerOn(pathname)) return null

  return (
    <section
      aria-label="Cookie choice"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card p-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center">
        <p className="flex-1 text-sm">
          We use browser storage to remember your choices, like your city, saved
          events, theme and checkout details. No tracking or ads.{' '}
          <Link to="/cookies" className="underline underline-offset-2">
            Read about cookies
          </Link>
        </p>
        <div className="flex gap-2">
          <Button variant="outline" className="min-h-11 flex-1 sm:flex-none" onClick={decline}>
            Decline
          </Button>
          <Button className="min-h-11 flex-1 sm:flex-none" onClick={accept}>
            Accept
          </Button>
        </div>
      </div>
    </section>
  )
}
