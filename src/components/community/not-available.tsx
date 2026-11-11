export function NotAvailable({ to, label }: { to: '/community/blueprints' | '/community/people'; label: string }) {
  return <section className="rounded-2xl border border-line bg-card p-6">
    <h1 className="text-2xl font-bold">This page isn't available.</h1>
    <p className="mt-2 text-muted-foreground">It may have been removed or made private.</p>
    <a href={to} className="mt-4 inline-flex min-h-11 items-center font-medium text-primary hover:underline">{label}</a>
  </section>
}
