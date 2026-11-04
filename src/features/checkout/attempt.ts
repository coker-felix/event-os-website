/**
 * Gives each checkout attempt an idempotency key. The same cart state
 * (fingerprint) always gets the same key, so a double tap on Pay is sent
 * as one order; a changed cart state gets a fresh key.
 */
export function createAttemptTracker(): { keyFor: (fingerprint: string) => string } {
  let lastFingerprint: string | null = null
  let lastKey = ''
  return {
    keyFor(fingerprint) {
      if (fingerprint !== lastFingerprint) {
        lastFingerprint = fingerprint
        lastKey = crypto.randomUUID()
      }
      return lastKey
    },
  }
}
