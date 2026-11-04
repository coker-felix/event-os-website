import { Link } from '@tanstack/react-router'
import { PRODUCTS } from '#/config/products'
import type { ProductId } from '#/config/products'

const SWITCHER_ORDER: Array<ProductId> = ['attendees', 'vendors', 'venues', 'organizers']
const SWITCHER_LABELS: Record<ProductId, string> = {
  attendees: 'Attendees',
  vendors: 'Vendors',
  venues: 'Venues',
  organizers: 'Organizers',
}

/** A small segmented control for moving between the three products. */
export function ProductSwitcher({ current }: { current: ProductId }) {
  return (
    <nav
      aria-label="Products"
      className="flex shrink-0 gap-0.5 rounded-md bg-secondary p-0.5 text-[13px]"
    >
      {SWITCHER_ORDER.map((id) => (
        <Link
          key={id}
          to={PRODUCTS[id].home}
          aria-current={id === current ? 'page' : undefined}
          className={
            id === current
              ? 'inline-flex h-8 items-center rounded-sm bg-card px-3 font-medium text-foreground shadow-sm'
              : 'inline-flex h-8 items-center rounded-sm px-3 font-medium text-muted-foreground hover:text-foreground'
          }
        >
          {SWITCHER_LABELS[id]}
        </Link>
      ))}
    </nav>
  )
}
