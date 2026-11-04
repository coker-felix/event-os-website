import { useMemo } from 'react'
import { formatPrice } from '#/features/events/money'
import {
  eventSaleState,
  selectedLines,
  subtotalMinor,
  ticketStatus,
} from '#/features/tickets/state'
import { TicketCard } from './ticket-card'
import { WaitlistForm } from './waitlist-form'
import type { TicketVariant } from './ticket-card'
import type { PublicEventPage, PublicTicketType } from '#/features/tickets/types'

function whenOnSale(t: PublicTicketType): string {
  if (!t.saleStartAt) return ''
  const d = new Date(t.saleStartAt * 1000)
  return `On sale ${new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d)}`
}

/** Ticket types and the buy button. Shared by the desktop panel and mobile sheet. */
export function TicketList({
  page,
  qtys,
  onStep,
  variant,
  onBuy,
  busy,
  error,
}: {
  page: PublicEventPage
  qtys: Record<string, number>
  onStep: (type: PublicTicketType, dir: 1 | -1) => void
  variant: TicketVariant
  onBuy: () => void
  busy: boolean
  error?: string
}) {
  const nowSec = useMemo(() => Math.floor(Date.now() / 1000), [])
  const state = eventSaleState(page, nowSec)
  const { event, ticketTypes } = page
  const buyable = ticketTypes.filter((t) => ticketStatus(t, nowSec) === 'buyable')
  const others = ticketTypes.filter((t) => ticketStatus(t, nowSec) !== 'buyable')
  const lines = selectedLines(qtys)
  const subtotal = subtotalMinor(ticketTypes, qtys)
  const free = state === 'free'

  if (state === 'cancelled') {
    return <p className="font-semibold">This event has been cancelled.</p>
  }

  return (
    <div>
      <h3 className="text-xl font-bold">Tickets</h3>

      {state === 'not_on_sale' ? (
        <p className="mt-3 text-mist">
          Tickets aren't on sale right now.
          {others.some((t) => ticketStatus(t, nowSec) === 'upcoming') &&
            ' Check back when sales open.'}
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {buyable.map((t) => (
            <TicketCard
              key={t.id}
              type={t}
              qty={qtys[t.id] ?? 0}
              onStep={(dir) => onStep(t, dir)}
              currency={event.currency}
              variant={variant}
            />
          ))}
        </div>
      )}

      {others.length > 0 && (
        <details className="mt-4 text-sm">
          <summary className="min-h-11 cursor-pointer font-semibold">
            Other tickets ({others.length})
          </summary>
          <ul className="mt-2 space-y-2">
            {others.map((t) => {
              const status = ticketStatus(t, nowSec)
              return (
                <li
                  key={t.id}
                  className="rounded-xl border border-line bg-card p-3"
                >
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold">{t.name}</span>
                    <span>{formatPrice(t.priceMinor, event.currency)}</span>
                  </div>
                  {status === 'sold_out' && (
                    <>
                      <p className="font-semibold">Sold out</p>
                      <WaitlistForm
                        eventId={event.id}
                        ticketTypeId={t.id}
                        ticketName={t.name}
                      />
                    </>
                  )}
                  {status === 'upcoming' && (
                    <p className="text-mist">{whenOnSale(t)}</p>
                  )}
                  {status === 'ended' && <p className="text-mist">Sale ended</p>}
                </li>
              )
            })}
          </ul>
        </details>
      )}

      {state !== 'not_on_sale' && (
        <div className="mt-5 border-t border-dashed border-line pt-4">
          {lines.length > 0 && (
            <ul className="space-y-1 text-sm">
              {ticketTypes
                .filter((t) => (qtys[t.id] ?? 0) > 0)
                .map((t) => (
                  <li key={t.id} className="flex justify-between">
                    <span>
                      {qtys[t.id]} × {t.name}
                    </span>
                  </li>
                ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-mist">
            Fees and tax shown at checkout
          </p>
          {error && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={onBuy}
            disabled={lines.length === 0 || busy}
            className="mt-3 h-12 w-full rounded-full bg-violet text-base font-semibold text-white disabled:opacity-50"
          >
            {busy
              ? 'Starting your order…'
              : free
                ? 'RSVP · Free'
                : lines.length > 0 && subtotal > 0
                  ? `Get tickets · ${formatPrice(subtotal, event.currency)}`
                  : 'Get tickets'}
          </button>
        </div>
      )}
    </div>
  )
}
