import { createFileRoute } from '@tanstack/react-router'
import { ShellPage } from '#/components/layout/shell-page'

export const Route = createFileRoute('/venues/')({
  head: () => ({ meta: [{ title: 'Venues | Event OS' }] }),
  component: VenuesPage,
})

function VenuesPage() {
  return <ShellPage title="Venues" />
}
