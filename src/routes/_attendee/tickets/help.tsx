import { createFileRoute } from '@tanstack/react-router'
import { ShellPage } from '#/components/layout/shell-page'

export const Route = createFileRoute('/_attendee/tickets/help')({
  head: () => ({ meta: [{ title: 'Ticket Self Help | Event OS' }] }),
  component: TicketHelpPage,
})

function TicketHelpPage() {
  return <ShellPage title="Ticket Self Help" />
}
