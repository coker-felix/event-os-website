import type { Blueprint } from '#/features/community/types'

export function BlueprintCard({ blueprint }: { blueprint: Blueprint }) {
  const formerMember = blueprint.authorLabel === 'Former member'
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-card p-5">
      <div className="flex flex-1 flex-col">
        <h2 className="text-lg leading-snug font-bold">
          <a href={`/community/blueprints/${encodeURIComponent(blueprint.id)}`} className="hover:underline focus-visible:underline">
            {blueprint.title}
          </a>
        </h2>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{blueprint.summary}</p>
        {blueprint.tags.length > 0 && <ul aria-label="Tags" className="mt-4 flex flex-wrap gap-2">
          {blueprint.tags.map((tag) => <li key={tag} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{tag}</li>)}
        </ul>}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-3 text-sm text-muted-foreground">
        <span>{formerMember ? 'By Former member' : blueprint.authorName && blueprint.authorUserId ? <>By <a href={`/community/people/${encodeURIComponent(blueprint.authorUserId)}`} className="font-medium text-foreground hover:underline">{blueprint.authorName}</a></> : blueprint.authorName ? `By ${blueprint.authorName}` : null}</span>
        <span>{blueprint.taskCount} tasks · {blueprint.forkCount ?? 0} uses</span>
      </div>
    </article>
  )
}
