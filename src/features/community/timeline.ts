import type { BlueprintTask } from './types'

export function orderTasks(tasks: Array<BlueprintTask>): Array<BlueprintTask> {
  const indexByKey = new Map(tasks.map((task, index) => [task.key, index]))
  const indegree = tasks.map(() => 0)
  const dependents = tasks.map(() => [] as Array<number>)
  tasks.forEach((task, index) => task.dependsOn.forEach((key) => {
    const dependencyIndex = indexByKey.get(key)
    if (dependencyIndex !== undefined && dependencyIndex !== index) {
      indegree[index] += 1
      dependents[dependencyIndex].push(index)
    }
  }))
  const ready = tasks.map((_, i) => i).filter(i => indegree[i] === 0)
  const ordered: Array<BlueprintTask> = []
  while (ready.length) {
    const index = ready.shift()!
    ordered.push(tasks[index])
    for (const dependent of dependents[index]) {
      indegree[dependent] -= 1
      if (indegree[dependent] === 0) {
        const position = ready.findIndex(i => i > dependent)
        if (position < 0) ready.push(dependent)
        else ready.splice(position, 0, dependent)
      }
    }
  }
  return ordered.length === tasks.length ? ordered : tasks
}

export function offsetLabel(amount: number, unit: string): string {
  if (amount === 0) return 'On the day'
  const phrase = unit === 'calendar_weeks' ? `${amount} ${amount === 1 ? 'week' : 'weeks'}`
    : unit === 'business_days' ? `${amount} business ${amount === 1 ? 'day' : 'days'}`
    : `${amount} ${amount === 1 ? 'day' : 'days'}`
  return `${phrase} before`
}
