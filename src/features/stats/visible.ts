export interface StatItem {
  value: number | null | undefined
  label: string
  /** Small label above the number, for example "Vendors". */
  group: string
  /** Where the tile leads, if anywhere. */
  to?: '/events' | '/vendors/directory' | '/vendors/callouts' | '/venues/directory'
}

/** Only real, positive numbers are shown; a failed call or a zero is dropped. */
export function visibleStats(
  stats: Array<StatItem>,
): Array<StatItem & { value: number }> {
  return stats.filter(
    (s): s is StatItem & { value: number } =>
      typeof s.value === 'number' && Number.isFinite(s.value) && s.value > 0,
  )
}
