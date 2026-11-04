import { createFileRoute } from '@tanstack/react-router'
import { ProductLayout } from '#/components/layout/product-layout'

export const Route = createFileRoute('/vendors')({
  component: () => <ProductLayout product="vendors" />,
})
