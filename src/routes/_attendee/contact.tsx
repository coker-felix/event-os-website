import { createFileRoute } from '@tanstack/react-router'
import { ShellPage } from '#/components/layout/shell-page'

export const Route = createFileRoute('/_attendee/contact')({
  head: () => ({ meta: [{ title: 'Contact Us | Event OS' }] }),
  component: ContactPage,
})

function ContactPage() {
  return <ShellPage title="Contact Us" />
}
