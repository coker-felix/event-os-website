import { Link } from '@tanstack/react-router'
import { PRODUCTS } from '#/config/products'
import type { ProductId } from '#/config/products'

const SWITCHER_ORDER: Array<ProductId> = ['attendees', 'vendors', 'venues']
const SWITCHER_LABELS: Record<ProductId, string> = {
  attendees: 'Attendees',
  vendors: 'Vendors',
  venues: 'Venues',
}

export function ProductSwitcher({ current }: { current: ProductId }) {
  return (
    <nav aria-label="Products" className="flex gap-1 text-sm">
      {SWITCHER_ORDER.map((id) => (
        <Link
          key={id}
          to={PRODUCTS[id].home}
          aria-current={id === current ? 'page' : undefined}
          className={
            id === current
              ? 'rounded-md bg-primary px-3 py-1 text-primary-foreground'
              : 'rounded-md px-3 py-1 text-muted-foreground hover:bg-accent'
          }
        >
          {SWITCHER_LABELS[id]}
        </Link>
      ))}
    </nav>
  )
}
