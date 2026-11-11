import { offsetLabel, orderTasks } from '#/features/community/timeline'
import type { BlueprintTask } from '#/features/community/types'

export function Timeline({ tasks }: { tasks: Array<BlueprintTask> }) {
  const ordered = orderTasks(tasks)
  const titles = new Map(tasks.map((task) => [task.key, task.title]))
  return <ol className="space-y-0 border-l border-line pl-5">
    {ordered.map((task) => <li key={task.key} className="relative pb-6 last:pb-0">
      <span aria-hidden className="absolute -left-[1.55rem] top-1 size-2.5 rounded-full bg-primary ring-4 ring-background" />
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{offsetLabel(task.offsetAmount, task.offsetUnit)}</p>
      <h3 className="mt-1 font-bold">{task.title}</h3>
      {task.dependsOn.length > 0 && <p className="mt-1 text-sm text-muted-foreground">Depends on: {task.dependsOn.map((key) => titles.get(key) ?? key).join(', ')}</p>}
    </li>)}
  </ol>
}
