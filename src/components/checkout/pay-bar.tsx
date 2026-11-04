import { formatPrice } from '#/features/events/money'

/** The pay button. Shared by the pinned mobile bar and the desktop summary. */
export function PayButton({
  label,
  busy,
  onPay,
}: {
  label: string
  busy: boolean
  onPay: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPay}
      disabled={busy}
      className="h-12 w-full rounded-full bg-violet px-6 text-base font-semibold text-white disabled:opacity-60"
    >
      {busy ? 'Working…' : label}
    </button>
  )
}

/** Phone layout: pinned to the bottom with the total and the pay button. */
export function PayBar({
  totalMinor,
  currency,
  label,
  busy,
  onPay,
}: {
  totalMinor: number
  currency?: string
  label: string
  busy: boolean
  onPay: () => void
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-4">
        <p className="shrink-0 text-base font-bold">
          {formatPrice(totalMinor, currency)}
        </p>
        <PayButton label={label} busy={busy} onPay={onPay} />
      </div>
    </div>
  )
}
