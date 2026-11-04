import { createFileRoute } from '@tanstack/react-router'
import { ShellPage } from '#/components/layout/shell-page'

export const Route = createFileRoute('/_attendee/events/$eventId/')({
  head: () => ({ meta: [{ title: 'Event Details | Event OS' }] }),
  component: EventDetailsPage,
})

function EventDetailsPage() {
  return <ShellPage title="Event Details" />
}
