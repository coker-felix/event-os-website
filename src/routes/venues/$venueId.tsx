import { createFileRoute } from '@tanstack/react-router'
import { ShellPage } from '#/components/layout/shell-page'

// Placeholder: Task 5 builds the real venue page.
export const Route = createFileRoute('/venues/$venueId')({
  head: () => ({ meta: [{ title: 'Venue | Event OS' }] }),
  component: () => <ShellPage title="Venue" />,
})
