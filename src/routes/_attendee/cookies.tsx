import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '#/components/legal/legal-page'
import { COOKIES } from '#/content/legal/cookies'
import { validateLegalSearch } from '#/lib/legal'

export const Route = createFileRoute('/_attendee/cookies')({
  validateSearch: validateLegalSearch,
  head: () => ({
    meta: [
      { title: 'Cookies and browser storage | EventRail' },
      { name: 'description', content: 'Everything EventRail keeps in your browser, why, and how to remove it.' },
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
      doc={COOKIES}
      audience={search.for}
      onAudience={(a) =>
        void navigate({ search: a ? { for: a } : {}, resetScroll: false })
      }
    />
  )
}
