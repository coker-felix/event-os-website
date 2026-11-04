import { Link } from '@tanstack/react-router'
import { PRODUCTS } from '#/config/products'
import { ProductSwitcher } from './product-switcher'
import type { ProductId } from '#/config/products'

export function SiteHeader({ product }: { product: ProductId }) {
  const { name, home, nav } = PRODUCTS[product]
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link to={home} className="text-lg font-semibold">
            {name}
          </Link>
          <nav aria-label="Primary" className="flex gap-4 text-sm">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-muted-foreground hover:text-foreground"
                activeProps={{ className: 'text-foreground font-medium' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <ProductSwitcher current={product} />
      </div>
    </header>
  )
}
