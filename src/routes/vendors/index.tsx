import { createFileRoute } from '@tanstack/react-router'
import { ShellPage } from '#/components/layout/shell-page'

export const Route = createFileRoute('/vendors/')({
  head: () => ({ meta: [{ title: 'Vendors | Event OS' }] }),
  component: VendorMarketingPage,
})

function VendorMarketingPage() {
  return <ShellPage title="Vendors" />
}
