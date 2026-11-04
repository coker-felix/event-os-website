import { useEffect, useState } from 'react'

interface PersistApi {
  hasHydrated: () => boolean
  onFinishHydration: (fn: () => void) => () => void
}

/** True once a persisted store has been read from storage. */
export function useHydrated(persist: PersistApi): boolean {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    if (persist.hasHydrated()) {
      setHydrated(true)
      return
    }
    return persist.onFinishHydration(() => setHydrated(true))
  }, [persist])
  return hydrated
}
