import { createFileRoute } from '@tanstack/react-router'
import { ShellPage } from '#/components/layout/shell-page'

// Placeholder: Task 7 builds the real vendor page.
export const Route = createFileRoute('/vendors/$vendorId')({
  head: () => ({ meta: [{ title: 'Vendor | Event OS' }] }),
  component: () => <ShellPage title="Vendor" />,
})
