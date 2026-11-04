import { createFileRoute } from '@tanstack/react-router'
import { ProductLayout } from '#/components/layout/product-layout'

export const Route = createFileRoute('/organizers')({
  component: () => <ProductLayout product="organizers" />,
})
