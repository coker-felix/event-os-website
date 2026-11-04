import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '#/components/legal/legal-page'
import { TERMS } from '#/content/legal/terms'
import { validateLegalSearch } from '#/lib/legal'

export const Route = createFileRoute('/_attendee/terms')({
  validateSearch: validateLegalSearch,
  head: () => ({
    meta: [
      { title: 'Terms of use | Event OS' },
      { name: 'description', content: 'The rules for attendees, vendors, event organizers and venue owners using Event OS.' },
    ],
  }),
  component: Page,
})

function Page() {
  // The router passes raw URL values through; check them again.
  const search = validateLegalSearch(Route.useSearch())
  const navigate = Route.useNavigate()
  return (
    <LegalPage
      doc={TERMS}
      audience={search.for}
      onAudience={(a) =>
        void navigate({ search: a ? { for: a } : {}, resetScroll: false })
      }
    />
  )
}
