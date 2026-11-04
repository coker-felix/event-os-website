/**
 * Invented data for fields the backend does not return yet (event price,
 * venue, stock; banners; blog posts; alert signup).
 *
 * On in `pnpm dev`. Off in production builds unless VITE_ENABLE_MOCKS=true,
 * so fake data cannot reach real visitors by accident. Real API values
 * always win over mock ones.
 */
export const MOCKS_ENABLED: boolean =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS === 'true'

/** Small stable hash (FNV-1a) so mock values do not change between renders. */
export function hash(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
