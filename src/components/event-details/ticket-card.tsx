import { useState } from 'react'
import { Info, Minus, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { formatPrice } from '#/features/events/money'
import { isLow, qtyBounds, volumeHint } from '#/features/tickets/state'
import type { PublicTicketType } from '#/features/tickets/types'

export type TicketVariant = 'panel' | 'sheet'

function Includes({ items }: { items: Array<string> }) {
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  )
}

/**
 * Full details of a ticket type. A dialog in the desktop panel; expanded
 * inline in the mobile sheet, so a dialog never opens on top of a sheet.
 */
function DetailsControl({
  type,
  variant,
}: {
  type: PublicTicketType
  variant: TicketVariant
}) {
  const [open, setOpen] = useState(false)
  const items = type.includes ?? []
  if (items.length === 0) return null
  const label = `About ${type.name}`

  if (variant === 'sheet') {
    return (
      <div className="mt-2">
        <button
          type="button"
          aria-expanded={open}
          aria-label={label}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-violet"
        >
          <Info className="size-4" aria-hidden />
          Details
        </button>
        {open && <Includes items={items} />}
      </div>
    )
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-violet hover:underline"
        >
          <Info className="size-4" aria-hidden />
          Details
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type.name}</DialogTitle>
          <DialogDescription>
            {type.description ?? "What's included"}
          </DialogDescription>
        </DialogHeader>
        <Includes items={items} />
      </DialogContent>
    </Dialog>
  )
}

const STEP_BUTTON =
  'grid size-11 place-items-center rounded-full border border-line bg-card text-ink disabled:opacity-40'

/** One buyable ticket type: name, price, description, stepper, details. */
export function TicketCard({
  type,
  qty,
  onStep,
  currency,
  variant,
}: {
  type: PublicTicketType
  qty: number
  onStep: (dir: 1 | -1) => void
  currency?: string
  variant: TicketVariant
}) {
  const { max } = qtyBounds(type)
  const hint = volumeHint(type, qty, currency)
  const bundle =
    type.admissionsPerUnit && type.admissionsPerUnit > 1
      ? `Admits ${type.admissionsPerUnit}`
      : null

  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-base font-bold">{type.name}</h4>
          {bundle && <p className="text-sm text-mist">{bundle}</p>}
          <p className="mt-1 text-lg font-bold">
            {formatPrice(type.priceMinor, currency)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={`Remove one ${type.name} ticket`}
            onClick={() => onStep(-1)}
            disabled={qty === 0}
            className={STEP_BUTTON}
          >
            <Minus className="size-4" aria-hidden />
          </button>
          <output
            aria-label={`${type.name} quantity`}
            className="w-6 text-center text-lg font-bold tabular-nums"
          >
            {qty}
          </output>
          <button
            type="button"
            aria-label={`Add one ${type.name} ticket`}
            onClick={() => onStep(1)}
            disabled={max === 0 || qty >= max}
            className={STEP_BUTTON}
          >
            <Plus className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      {type.description && (
        <p className="mt-2 text-sm text-mist">{type.description}</p>
      )}
      {isLow(type) && (
        <p className="mt-2 text-sm font-semibold text-flame">Selling fast</p>
      )}
      {hint && (
        <p className="mt-2 rounded-lg bg-secondary px-3 py-2 text-sm">{hint}</p>
      )}
      <DetailsControl type={type} variant={variant} />
    </div>
  )
}
