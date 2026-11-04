import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface StoredCart {
  cartId: string
  /** Opaque access token for a guest cart; sent as `X-Cart-Token`. */
  token: string
}

interface CartsState {
  byEvent: Record<string, StoredCart>
  setCart: (eventId: string, cart: StoredCart) => void
  clearCart: (eventId: string) => void
}

/**
 * One cart per event, kept in localStorage so a refresh or a return from
 * Paystack still finds it. Hydrated after mount like `usePreferences`.
 */
export const useCarts = create<CartsState>()(
  persist(
    (set) => ({
      byEvent: {},
      setCart: (eventId, cart) =>
        set((s) => ({ byEvent: { ...s.byEvent, [eventId]: cart } })),
      clearCart: (eventId) =>
        set((s) => {
          const { [eventId]: _removed, ...rest } = s.byEvent
          return { byEvent: rest }
        }),
    }),
    {
      name: 'event-os:carts',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
)
