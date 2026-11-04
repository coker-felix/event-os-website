import { useEffect, useState } from 'react'
import { useCarts } from '#/stores/carts'

/**
 * True once the persisted carts have been read from localStorage. Before
 * that the store is empty, which must not look like "no cart".
 */
export function useCartsHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    if (useCarts.persist.hasHydrated()) {
      setHydrated(true)
      return
    }
    return useCarts.persist.onFinishHydration(() => setHydrated(true))
  }, [])
  return hydrated
}
