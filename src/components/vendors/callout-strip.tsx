import { Link } from '@tanstack/react-router'
import { portalUrl } from '#/features/vendors/portal'
import { useCalloutCards } from '#/features/vendors/use-callout-cards'
import { CalloutCard } from './callout-card'
import { CTA } from '#/lib/cta'

const SHOWN = 3

/**
 * "Open now": the live leads, straight under the hero. With none open it says
 * so honestly and points at creating a profile.
 */
export function CalloutStrip() {
  const { cards, isPending, isError, hasMore } = useCalloutCards({ page: 1 })
  const count = `${cards.length}${hasMore ? '+' : ''}`

  return (
    <section aria-label="Open now" className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-violet-ink uppercase">
            Fresh opportunities
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {cards.length > 0
              ? `Open now: ${count} ${cards.length === 1 && !hasMore ? 'callout' : 'callouts'}`
              : 'Open now'}
          </h2>
        </div>
        {cards.length > 0 && (
          <Link
            to="/vendors/callouts"
            className="text-sm font-semibold text-violet-ink underline decoration-violet-ink/30 underline-offset-4 hover:decoration-current"
          >
            See all callouts
          </Link>
        )}
      </div>

      {isPending ? (
        <p className="mt-4 text-mist" role="status">
          Loading callouts…
        </p>
      ) : isError ? (
        <p className="mt-4 text-mist" role="status">
          We couldn't load callouts just now.{' '}
          <Link
            to="/vendors/callouts"
            className="font-semibold text-violet-ink hover:underline"
          >
            Try the callouts page
          </Link>
          .
        </p>
      ) : cards.length === 0 ? (
        <div className="mt-5 rounded-3xl border border-line bg-card p-6 sm:p-7">
          <p className="text-lg font-semibold">No open callouts right now.</p>
          <p className="mt-1 text-mist">
            Create your profile and you'll be ready when one opens.
          </p>
          <a href={portalUrl('/register')} className={`${CTA.primary} mt-4`}>
            Create your profile
          </a>
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {cards.slice(0, SHOWN).map((c) => (
            <li key={c.callout.id}>
              <CalloutCard card={c} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
