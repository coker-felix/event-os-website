import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '#/components/legal/legal-page'
import { PRIVACY } from '#/content/legal/privacy'
import { validateLegalSearch } from '#/lib/legal'

export const Route = createFileRoute('/_attendee/privacy')({
  validateSearch: validateLegalSearch,
  head: () => ({
    meta: [
      { title: 'Privacy policy | Event OS' },
      { name: 'description', content: 'What Event OS collects, why, and your choices. No tracking or advertising.' },
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
      doc={PRIVACY}
      audience={search.for}
      onAudience={(a) =>
        void navigate({ search: a ? { for: a } : {}, resetScroll: false })
      }
    />
  )
}
