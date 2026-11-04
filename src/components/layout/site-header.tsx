import { Link } from '@tanstack/react-router'
import { PRODUCTS } from '#/config/products'
import { portalUrl } from '#/features/vendors/portal'
import { ProductSwitcher } from './product-switcher'
import { ThemeToggle } from './theme-toggle'
import type { ProductId } from '#/config/products'

export function SiteHeader({ product }: { product: ProductId }) {
  const { name, home, nav, actions } = PRODUCTS[product]
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
        <div className="flex flex-wrap items-center gap-3">
          {actions?.map((a) => (
            <a
              key={a.path}
              href={portalUrl(a.path)}
              className={
                a.variant === 'primary'
                  ? 'inline-flex h-11 items-center rounded-full bg-violet px-5 text-sm font-semibold text-white hover:opacity-90'
                  : 'inline-flex h-11 items-center px-3 text-sm font-semibold hover:underline'
              }
            >
              {a.label}
            </a>
          ))}
          <ThemeToggle />
          <ProductSwitcher current={product} />
        </div>
      </div>
    </header>
  )
}
