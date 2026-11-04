import { createFileRoute } from '@tanstack/react-router'
import { ShellPage } from '#/components/layout/shell-page'

export const Route = createFileRoute('/_attendee/blog/')({
  head: () => ({ meta: [{ title: 'Blog | Event OS' }] }),
  component: BlogPage,
})

function BlogPage() {
  return <ShellPage title="Blog" />
}
