import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { PRODUCTS } from '#/config/products'
import { portalUrl } from '#/features/vendors/portal'
import { CTA } from '#/lib/cta'
import { ProductSwitcher } from './product-switcher'
import { ThemeToggle } from './theme-toggle'
import { BrandMark } from './brand-mark'
import { useQuery } from '@tanstack/react-query'
import { statusQuery } from '#/features/community/queries'
import { communityLinks } from '#/features/community/links'
import type { ProductId } from '#/config/products'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'

/**
 * Full navigation on larger screens and a mode-aware drawer on smaller screens.
 */
export function SiteHeader({ product }: { product: ProductId }) {
  const { name, home } = PRODUCTS[product]
  const communityEnabled = useQuery(statusQuery()).data?.blueprints === true
  const { nav, actions } = PRODUCTS[product]
  const visibleNav = product === 'community' && !communityEnabled ? [] : nav
  const visibleActions = product === 'community' && !communityEnabled ? [] : actions
  const actionHref = (label: string, path: string) => product === 'community'
    ? label === 'Join' ? communityLinks.join() : communityLinks.signIn()
    : portalUrl(path)
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/85 font-ui backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-0 px-4 xl:flex-nowrap">
        <Link
          to={home}
          className="flex h-14 shrink-0 items-center gap-2 text-[15px] font-semibold tracking-tight"
        >
          <BrandMark />
          {name}
        </Link>

        <div className="order-3 -mx-4 hidden w-[calc(100%+2rem)] items-center gap-5 overflow-x-auto px-4 pb-2 md:flex xl:order-2 xl:mx-0 xl:ml-auto xl:w-auto xl:flex-1 xl:overflow-visible xl:px-0 xl:pb-0">
          <ProductSwitcher current={product} />
          <span aria-hidden className="h-4 w-px shrink-0 bg-line" />
          <nav aria-label="Primary" className="flex min-w-0 gap-1 text-sm">
            {visibleNav.map((item) => (
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

        <div className="order-2 ml-auto hidden items-center gap-1.5 md:flex xl:order-3 xl:ml-0">
          {visibleActions?.map((a) => (
            <a
              key={a.path}
              href={actionHref(a.label, a.path)}
              className={a.variant === 'primary' ? CTA.nav : CTA.navQuiet}
            >
              {a.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={`Open ${product} menu`}
                className="grid size-11 place-items-center rounded-sm text-foreground transition-colors active:bg-secondary"
              >
                <Menu className="size-5" aria-hidden />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(92vw,24rem)] gap-0 overflow-y-auto px-0 pt-12 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
            >
              <SheetHeader className="px-5 pb-5">
                <SheetTitle className="text-left">{name}</SheetTitle>
                <SheetDescription className="text-left">
                  {PRODUCTS[product].tagline}
                </SheetDescription>
              </SheetHeader>
              <div className="border-y border-line px-5 py-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Explore EventRail
                </p>
                <div className="-mx-1 overflow-x-auto px-1 pb-1">
                  <SheetClose asChild>
                    <ProductSwitcher current={product} />
                  </SheetClose>
                </div>
              </div>
              <nav aria-label={`${product} navigation`} className="flex flex-col p-3">
                {visibleNav.map((item) => (
                  <SheetClose key={item.to} asChild>
                    <Link
                      to={item.to}
                      hash={item.hash}
                      activeOptions={{ includeHash: true }}
                      className="flex min-h-12 items-center rounded-sm px-3 text-[15px] font-medium text-foreground transition-colors active:bg-secondary"
                      activeProps={{ className: 'bg-primary/10 text-foreground' }}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              {visibleActions?.length ? (
                <div className="mt-auto flex flex-col gap-2 border-t border-line p-5">
                  {visibleActions.map((a) => (
                    <SheetClose key={a.path} asChild>
                      <a
                        href={actionHref(a.label, a.path)}
                        className={a.variant === 'primary' ? CTA.nav : CTA.navQuiet}
                      >
                        {a.label}
                      </a>
                    </SheetClose>
                  ))}
                </div>
              ) : null}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
