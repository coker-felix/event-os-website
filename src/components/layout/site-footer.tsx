import { Link } from '@tanstack/react-router'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-4 py-6 text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Event OS</span>
        <nav aria-label="Footer" className="flex gap-4">
          <Link to="/vendors">For vendors</Link>
          <Link to="/venues">For venues</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}
