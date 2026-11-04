import { createFileRoute } from '@tanstack/react-router'
import { ShellPage } from '#/components/layout/shell-page'

export const Route = createFileRoute('/_attendee/')({
  head: () => ({ meta: [{ title: 'Landing Page | Event OS' }] }),
  component: Landing,
})

function Landing() {
  return <ShellPage title="Landing Page" />
}
