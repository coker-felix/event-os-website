import { createFileRoute } from '@tanstack/react-router'
import { ShellPage } from '#/components/layout/shell-page'

export const Route = createFileRoute('/_attendee/events/$eventId/checkout')({
  head: () => ({ meta: [{ title: 'Event Checkout | Event OS' }] }),
  component: EventCheckoutPage,
})

function EventCheckoutPage() {
  return <ShellPage title="Event Checkout" />
}
