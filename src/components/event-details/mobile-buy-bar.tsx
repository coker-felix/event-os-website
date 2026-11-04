import { useMemo } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '#/components/ui/sheet'
import { formatPrice } from '#/features/events/money'
import { eventSaleState, ticketStatus } from '#/features/tickets/state'
import { TicketList } from './ticket-list'
import type { PublicEventPage, PublicTicketType } from '#/features/tickets/types'

/**
 * Phone layout: a bar pinned to the bottom ("From ₦8,000 · Get tickets")
 * that opens a sheet with the same ticket list as the desktop panel.
 */
export function MobileBuyBar({
  page,
  qtys,
  onStep,
  onBuy,
  busy,
  error,
}: {
  page: PublicEventPage
  qtys: Record<string, number>
  onStep: (type: PublicTicketType, dir: 1 | -1) => void
  onBuy: () => void
  busy: boolean
  error?: string
}) {
  const nowSec = useMemo(() => Math.floor(Date.now() / 1000), [])
  const state = eventSaleState(page, nowSec)
  if (state === 'not_on_sale' || state === 'cancelled') return null

  const prices = page.ticketTypes
    .filter((t) => ticketStatus(t, nowSec) === 'buyable')
    .map((t) => t.priceMinor)
  const from = prices.length ? Math.min(...prices) : undefined
  const fromLabel = formatPrice(from, page.event.currency)

  return (
    <Sheet>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="text-sm">
            {fromLabel && fromLabel !== 'Free' ? (
              <>
                From <strong className="text-base">{fromLabel}</strong>
              </>
            ) : (
              <strong className="text-base">Free</strong>
            )}
          </p>
          <SheetTrigger asChild>
            <button
              type="button"
              className="h-12 rounded-full bg-violet px-8 font-semibold text-white"
            >
              {state === 'free' ? 'RSVP' : 'Get tickets'}
            </button>
          </SheetTrigger>
        </div>
      </div>
      <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto rounded-t-3xl">
        <SheetHeader className="sr-only">
          <SheetTitle>Tickets</SheetTitle>
          <SheetDescription>Choose your tickets.</SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <TicketList
            page={page}
            qtys={qtys}
            onStep={onStep}
            variant="sheet"
            onBuy={onBuy}
            busy={busy}
            error={error}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
