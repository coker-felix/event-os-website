import { Outlet } from '@tanstack/react-router'
import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'
import type { ProductId } from '#/config/products'

export function ProductLayout({ product }: { product: ProductId }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader product={product} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
