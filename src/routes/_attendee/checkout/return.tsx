import { createFileRoute } from '@tanstack/react-router'
import { ShellPage } from '#/components/layout/shell-page'

interface ReturnSearch {
  order?: string
  reference?: string
}

// Placeholder: Task 8 builds the real payment return page.
export const Route = createFileRoute('/_attendee/checkout/return')({
  validateSearch: (s: Record<string, unknown>): ReturnSearch => ({
    order: typeof s.order === 'string' ? s.order : undefined,
    reference: typeof s.reference === 'string' ? s.reference : undefined,
  }),
  head: () => ({ meta: [{ title: 'Payment | Event OS' }] }),
  component: () => <ShellPage title="Payment" />,
})
