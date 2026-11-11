import { Link } from '@tanstack/react-router'
import { PRODUCTS } from '#/config/products'
import type { ProductId } from '#/config/products'
import { useQuery } from '@tanstack/react-query'
import { statusQuery } from '#/features/community/queries'

const SWITCHER_ORDER: Array<ProductId> = ['attendees', 'organizers', 'vendors', 'venues', 'community']
const SWITCHER_LABELS: Record<ProductId, string> = {
  attendees: 'Attendees',
  organizers: 'Organizers',
  vendors: 'Vendors',
  venues: 'Venues',
  community: 'Community',
}

/** A small segmented control for moving between the three products. */
export function ProductSwitcher({ current }: { current: ProductId }) {
  const communityEnabled = useQuery(statusQuery()).data?.blueprints === true
  const products = SWITCHER_ORDER.filter((id) => id !== 'community' || communityEnabled)
  return (
    <nav
      aria-label="Products"
      className="flex shrink-0 gap-0.5 rounded-md bg-secondary p-0.5 text-[13px]"
    >
      {products.map((id) => (
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
