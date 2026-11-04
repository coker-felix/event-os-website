/** Delay for the nth item of a group, capped so long lists stay snappy. */
export function staggerDelay(index: number, stepMs = 60, maxMs = 300): number {
  return Math.min(Math.max(index, 0) * stepMs, maxMs)
}

/** True when the device asks for less motion. False on the server. */
export function prefersReducedMotion(
  match: ((q: string) => { matches: boolean }) | undefined = typeof matchMedia ===
  'function'
    ? matchMedia
    : undefined,
): boolean {
  if (!match) return false
  return match('(prefers-reduced-motion: reduce)').matches
}
