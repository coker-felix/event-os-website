import { createFileRoute } from '@tanstack/react-router'
import { ProductLayout } from '#/components/layout/product-layout'
import { statusQuery } from '#/features/community/queries'

export const Route = createFileRoute('/community')({
  loader: async ({ context: { queryClient } }) => {
    const [status] = await Promise.allSettled([
      queryClient.ensureQueryData(statusQuery()),
    ])
    return { status: status.status === 'fulfilled' ? status.value : undefined }
  },
  head: () => ({
    meta: [
      { title: 'Community | EventRail' },
      { name: 'description', content: 'Explore event blueprints and meet the people behind them.' },
    ],
  }),
  component: () => <ProductLayout product="community" />,
})
