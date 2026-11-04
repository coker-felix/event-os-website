import { createFileRoute } from '@tanstack/react-router'
import { ShellPage } from '#/components/layout/shell-page'

export const Route = createFileRoute('/_attendee/events/')({
  head: () => ({ meta: [{ title: 'All Events | Event OS' }] }),
  component: EventsPage,
})

function EventsPage() {
  return <ShellPage title="All Events" />
}
