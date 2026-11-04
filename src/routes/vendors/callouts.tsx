import { createFileRoute } from '@tanstack/react-router'
import { ShellPage } from '#/components/layout/shell-page'

export const Route = createFileRoute('/vendors/callouts')({
  head: () => ({ meta: [{ title: 'Vendor Callouts | Event OS' }] }),
  component: VendorCalloutsPage,
})

function VendorCalloutsPage() {
  return <ShellPage title="Vendor Callouts" />
}
