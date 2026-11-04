import { Link } from '@tanstack/react-router'
import { getJobs, getTeam } from '#/features/company/data'

const LINK =
  'inline-flex h-9 items-center rounded-sm px-3 text-sm font-medium text-muted-foreground hover:text-foreground'

/** Switches between the company pages. Team and Careers appear only when they have content. */
export function CompanyNav() {
  const hasTeam = getTeam().length > 0
  const hasJobs = getJobs().length > 0
  return (
    <nav aria-label="Company" className="mb-8 flex flex-wrap gap-1 border-b border-line pb-3">
      <Link to="/about" activeOptions={{ exact: true }} className={LINK} activeProps={{ className: 'text-foreground bg-secondary' }}>
        About
      </Link>
      {hasTeam && (
        <Link to="/about/team" className={LINK} activeProps={{ className: 'text-foreground bg-secondary' }}>
          Team
        </Link>
      )}
      {hasJobs && (
        <Link to="/careers" className={LINK} activeProps={{ className: 'text-foreground bg-secondary' }}>
          Careers
        </Link>
      )}
      <Link to="/contact" className={LINK} activeProps={{ className: 'text-foreground bg-secondary' }}>
        Contact
      </Link>
    </nav>
  )
}
