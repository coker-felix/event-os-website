import { createFileRoute } from '@tanstack/react-router'
import { RsvpPage } from '#/components/guest-invitations/rsvp-page'

export const Route = createFileRoute('/rsvp/$token')({
  head: () => ({
    meta: [
      { title: 'Your invitation | EventRail' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: RsvpRoute,
})

function RsvpRoute() {
  const { token } = Route.useParams()
  return <RsvpPage token={token} />
}
