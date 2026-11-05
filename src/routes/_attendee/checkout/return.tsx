import { useEffect, useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { CalendarPlus, CheckCircle2, Clock, XCircle } from 'lucide-react'
import {
  nextPollDelay,
  orderStatusQuery,
  parseReturnParams,
} from '#/features/checkout/order-status'
import { calendarLinks } from '#/features/events/calendar'
import { formatPrice } from '#/features/events/money'
import { eventPageQuery } from '#/features/tickets/queries'
import { useCarts } from '#/stores/carts'
import type { OrderStatus, ReturnParams } from '#/features/checkout/order-status'
import { CTA } from '#/lib/cta'

export const Route = createFileRoute('/_attendee/checkout/return')({
  validateSearch: (s: Record<string, unknown>): ReturnParams =>
    parseReturnParams(s),
  loaderDeps: ({ search }) => parseReturnParams(search),
  // Check the payment on the server so the first paint already shows the outcome.
  loader: async ({ context: { queryClient }, deps }) => {
    if (!deps.reference && !deps.order) return
    await Promise.allSettled([
      queryClient.ensureQueryData(orderStatusQuery(deps)),
    ])
  },
  head: () => ({
    meta: [
      { title: 'Your payment | EventRail' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: ReturnPage,
})

function Panel({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-line bg-card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        {icon}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

const BTN_PRIMARY =
  `${CTA.primary}`
const BTN_SECONDARY =
  `${CTA.outline}`

function PaidView({ status }: { status: OrderStatus }) {
  const event = useQuery({
    ...eventPageQuery(status.eventId ?? ''),
    enabled: !!status.eventId,
  })
  const links = event.data ? calendarLinks(event.data.event) : null
  return (
    <Panel
      icon={<CheckCircle2 className="size-8 text-violet-ink" aria-hidden />}
      title="You're going!"
    >
      <div className="rounded-2xl border border-line">
        <div className="p-4">
          <p className="text-sm text-mist">Order</p>
          <p className="font-display text-xl font-extrabold">{status.orderId}</p>
          {event.data && (
            <p className="mt-1 font-semibold">{event.data.event.title}</p>
          )}
        </div>
        <div className="stub-divider" aria-hidden />
        <div className="flex items-center justify-between p-4 text-sm">
          <span>
            {status.deliveredTo
              ? `Sent to ${status.deliveredTo}`
              : 'We sent your tickets to your contact details.'}
          </span>
          <strong>{formatPrice(status.total, status.currency)}</strong>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {links && (
          <a
            href={links.google}
            target="_blank"
            rel="noopener noreferrer"
            className={BTN_SECONDARY}
          >
            <CalendarPlus className="mr-2 size-4" aria-hidden />
            Add to calendar
          </a>
        )}
        <Link to="/tickets/help" className={BTN_PRIMARY}>
          Find my tickets
        </Link>
      </div>
    </Panel>
  )
}

function ReturnPage() {
  const raw = Route.useSearch()
  const ref = useMemo(
    () => parseReturnParams(raw as Record<string, unknown>),
    [raw],
  )
  const hasRef = !!(ref.reference || ref.order)
  const clearCart = useCarts((s) => s.clearCart)

  const query = useQuery({
    ...orderStatusQuery(ref),
    enabled: hasRef,
    refetchInterval: (q) => {
      const current = q.state.data?.status
      if (current && current !== 'pending') return false
      return nextPollDelay(Math.max(0, q.state.dataUpdateCount - 1)) ?? false
    },
  })
  const status = query.data

  // How many checks have come back, to know when to stop saying "a few seconds".
  const [checks, setChecks] = useState(0)
  useEffect(() => {
    if (query.dataUpdatedAt) setChecks((c) => c + 1)
  }, [query.dataUpdatedAt])

  // A paid order has used up its cart.
  useEffect(() => {
    if (status?.status === 'paid' && status.eventId) clearCart(status.eventId)
  }, [status, clearCart])

  if (!hasRef) {
    return (
      <Panel
        icon={<XCircle className="size-8 text-flame" aria-hidden />}
        title="We can't find that payment"
      >
        <p className="text-mist">
          The link may be incomplete. If you paid, your tickets are on their way
          to the phone number or email you used.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/tickets/help" className={BTN_PRIMARY}>
            Find my tickets
          </Link>
          <Link to="/contact" className={BTN_SECONDARY}>
            Contact us
          </Link>
        </div>
      </Panel>
    )
  }

  if (query.isPending) {
    return (
      <p className="text-center text-mist" role="status">
        Checking your payment…
      </p>
    )
  }
  if (query.isError) {
    return (
      <Panel
        icon={<XCircle className="size-8 text-flame" aria-hidden />}
        title="We couldn't check your payment"
      >
        <p className="text-mist">
          Check your connection, then try again. If you were charged, your
          tickets will still be sent.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => query.refetch()}
            className={BTN_PRIMARY}
          >
            Try again
          </button>
          <Link to="/contact" className={BTN_SECONDARY}>
            Contact us
          </Link>
        </div>
      </Panel>
    )
  }

  if (status?.status === 'paid') return <PaidView status={status} />

  if (status?.status === 'failed') {
    return (
      <Panel
        icon={<XCircle className="size-8 text-flame" aria-hidden />}
        title="Payment didn't go through"
      >
        <p className="text-mist">
          You haven't been charged. Your tickets are still in your cart.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {status.eventId ? (
            <Link
              to="/events/$eventId/checkout"
              params={{ eventId: status.eventId }}
              className={BTN_PRIMARY}
            >
              Try again
            </Link>
          ) : (
            <Link to="/events" className={BTN_PRIMARY}>
              Back to events
            </Link>
          )}
          <Link to="/contact" className={BTN_SECONDARY}>
            Contact us
          </Link>
        </div>
      </Panel>
    )
  }

  const waited =
    nextPollDelay(Math.max(0, checks - 1)) === null
  return (
    <Panel
      icon={<Clock className="size-8 text-violet-ink" aria-hidden />}
      title="Confirming your payment…"
    >
      <p className="text-mist" role="status">
        {waited
          ? "This is taking longer than usual. We'll text you when your payment clears, and you can close this page."
          : "This usually takes a few seconds. We'll text you when it clears, and you can close this page."}
      </p>
      {waited && (
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/tickets/help" className={BTN_PRIMARY}>
            Find my tickets
          </Link>
          <Link to="/contact" className={BTN_SECONDARY}>
            Contact us
          </Link>
        </div>
      )}
    </Panel>
  )
}
