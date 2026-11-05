import { Link } from '@tanstack/react-router'
import { PRODUCTS } from '#/config/products'
import { portalUrl } from '#/features/vendors/portal'
import { CTA } from '#/lib/cta'
import { ProductSwitcher } from './product-switcher'
import { ThemeToggle } from './theme-toggle'
import type { ProductId } from '#/config/products'

/**
 * Brand and account actions on the first row; the product switcher and page
 * links on a scrolling second row on phones, all one row from `md` up.
 */
export function SiteHeader({ product }: { product: ProductId }) {
  const { name, home, nav, actions } = PRODUCTS[product]
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/85 font-ui backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 px-4 md:flex-nowrap">
        <Link
          to={home}
          className="order-1 flex h-14 items-center text-[15px] font-semibold tracking-tight"
        >
          {name}
        </Link>

        <div className="order-3 -mx-4 flex w-[calc(100%+2rem)] items-center gap-5 overflow-x-auto px-4 pb-2 md:order-2 md:mx-0 md:w-auto md:flex-1 md:overflow-visible md:p-0">
          <ProductSwitcher current={product} />
          <span aria-hidden className="hidden h-4 w-px bg-line md:block" />
          <nav aria-label="Primary" className="flex gap-1 text-sm">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                hash={item.hash}
                activeOptions={{ includeHash: true }}
                className="inline-flex h-9 items-center rounded-sm px-2.5 font-medium whitespace-nowrap text-muted-foreground hover:text-foreground"
                activeProps={{ className: 'bg-primary/10 text-foreground' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="order-2 ml-auto flex items-center gap-1.5 md:order-3">
          {actions?.map((a) => (
            <a
              key={a.path}
              href={portalUrl(a.path)}
              className={a.variant === 'primary' ? CTA.nav : CTA.navQuiet}
            >
              {a.label}
            </a>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
