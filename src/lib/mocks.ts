/**
 * Invented data for fields the backend does not return yet (event price,
 * venue, stock; banners; blog posts; alert signup).
 *
 * On in `pnpm dev` and in tests. Off in production builds unless
 * VITE_ENABLE_MOCKS=true, so fake data cannot reach real visitors by
 * accident. Real API values always win over mock ones.
 *
 * `__MOCKS_ENABLED__` is replaced by a literal at build time (see
 * vite.config.ts), which lets the bundler remove every mock when it is off.
 */
declare const __MOCKS_ENABLED__: boolean

export const MOCKS_ENABLED: boolean = __MOCKS_ENABLED__

/** Small stable hash (FNV-1a) so mock values do not change between renders. */
export function hash(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** A stable UUID-shaped id from a seed, so invented records pass UUID checks. */
export function uuidFromSeed(seed: string): string {
  const hex = (part: string) => hash(seed + part).toString(16).padStart(8, '0')
  return `${hex('a')}-${hex('b').slice(0, 4)}-${hex('c').slice(0, 4)}-${hex('d').slice(0, 4)}-${hex('e')}${hex('f').slice(0, 4)}`
}
