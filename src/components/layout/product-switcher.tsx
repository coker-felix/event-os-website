import { Link } from '@tanstack/react-router'
import { PRODUCTS } from '#/config/products'
import type { ProductId } from '#/config/products'

const SWITCHER_ORDER: Array<ProductId> = [
  'attendees',
  'organizers',
  'vendors',
  'venues',
  'community',
]
const SWITCHER_LABELS: Record<ProductId, string> = {
  attendees: 'Attendees',
  organizers: 'Organizers',
  vendors: 'Vendors',
  venues: 'Venues',
  community: 'Community',
}

/** A small segmented control for moving between the three products. */
export function ProductSwitcher({
  current,
  variant = 'pill',
}: {
  current: ProductId
  variant?: 'default' | 'pill'
}) {
  // Community is always reachable; /community itself explains when it is
  // coming soon or unavailable.
  const products = SWITCHER_ORDER
  return (
    <nav
      aria-label="Products"
      className={
        variant === 'pill'
          ? 'flex shrink-0 gap-0.5 rounded-full border border-line bg-card p-1 text-[13px]'
          : 'flex shrink-0 gap-0.5 rounded-md bg-secondary p-0.5 text-[13px]'
      }
    >
      {products.map((id) => (
        <Link
          key={id}
          to={PRODUCTS[id].home}
          aria-current={id === current ? 'page' : undefined}
          className={
            id === current
              ? variant === 'pill'
                ? 'inline-flex h-8 items-center rounded-full bg-[#1f3d2f] px-3.5 font-medium text-[#f6f1e7] shadow-sm'
                : 'inline-flex h-8 items-center rounded-sm bg-card px-3 font-medium text-foreground shadow-sm'
              : variant === 'pill'
                ? 'inline-flex h-8 items-center rounded-full px-3.5 font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground'
                : 'inline-flex h-8 items-center rounded-sm px-3 font-medium text-muted-foreground hover:text-foreground'
          }
        >
          {SWITCHER_LABELS[id]}
        </Link>
      ))}
    </nav>
  )
}
