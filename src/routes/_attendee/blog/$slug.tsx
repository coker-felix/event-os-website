import { createFileRoute } from '@tanstack/react-router'
import { ShellPage } from '#/components/layout/shell-page'

export const Route = createFileRoute('/_attendee/blog/$slug')({
  head: () => ({ meta: [{ title: 'Blog Post | Event OS' }] }),
  component: BlogPostPage,
})

function BlogPostPage() {
  return <ShellPage title="Blog Post" />
}
