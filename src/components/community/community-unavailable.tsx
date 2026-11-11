import { CTA } from '#/lib/cta'

export function CommunityUnavailable({ onRetry }: { onRetry: () => void }) {
  return <section role="alert" className="rounded-2xl border border-line bg-card p-6">
    <h1 className="text-2xl font-bold">We can't load the community right now.</h1>
    <p className="mt-2 text-muted-foreground">Try again in a minute.</p>
    <button type="button" onClick={onRetry} className={`${CTA.primary} mt-4`}>Try again</button>
  </section>
}
