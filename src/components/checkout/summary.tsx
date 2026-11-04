import { formatPrice } from '#/features/events/money'
import type { Cart } from '#/features/checkout/types'

/**
 * Order summary from the cart quote. The quote carries line totals,
 * the volume discount and the subtotal; it does not carry fees or tax,
 * so the page says plainly that they are added when the buyer pays.
 */
export function Summary({
  cart,
  action,
}: {
  cart: Cart
  /** Pay button shown inside the card on desktop. */
  action?: React.ReactNode
}) {
  const lines = cart.quoteLines ?? []
  const total = cart.subtotalMinor ?? 0
  const discount = cart.volumeDiscountMinor ?? 0
  return (
    <section
      aria-label="Order summary"
      className="rounded-2xl border border-line bg-card p-5"
    >
      <h2 className="text-lg font-bold">Summary</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {lines.map((l) => (
          <li key={l.ticketTypeId} className="flex justify-between gap-3">
            <span>
              {l.qty} × {l.name}
            </span>
            <span>{formatPrice(l.lineTotalMinor, cart.currency)}</span>
          </li>
        ))}
        {discount > 0 && (
          <li className="flex justify-between gap-3 text-violet-ink">
            <span>Volume discount</span>
            <span>-{formatPrice(discount, cart.currency)}</span>
          </li>
        )}
      </ul>
      <div className="mt-3 flex justify-between border-t border-dashed border-line pt-3 text-base font-bold">
        <span>{total === 0 ? 'Total' : 'Subtotal'}</span>
        <span>{formatPrice(total, cart.currency)}</span>
      </div>
      {total > 0 && (
        <p className="mt-1 text-xs text-mist">
          Fees and tax, if any, are added when you pay.
        </p>
      )}
      {action && <div className="mt-4 hidden lg:block">{action}</div>}
    </section>
  )
}
