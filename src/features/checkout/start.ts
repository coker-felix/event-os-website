import { useCarts } from '#/stores/carts'
import { createCart } from './api'
import type { StoredCart } from '#/stores/carts'
import type { CartLine, CartResponse } from './types'

interface StartDeps {
  createCart: (eventId: string, lines: Array<CartLine>) => Promise<CartResponse>
  stored: (eventId: string) => StoredCart | undefined
  save: (eventId: string, cart: StoredCart) => void
}

const defaults: StartDeps = {
  createCart: (eventId, lines) => createCart(eventId, lines),
  stored: (eventId) => useCarts.getState().byEvent[eventId],
  save: (eventId, cart) => useCarts.getState().setCart(eventId, cart),
}

/**
 * Create a cart for the chosen tickets and remember its token, so the
 * checkout page can load it. Returns the cart id to navigate with.
 */
export async function startCheckout(
  eventId: string,
  lines: Array<CartLine>,
  deps: StartDeps = defaults,
): Promise<{ cartId: string }> {
  const { cart, accessToken } = await deps.createCart(eventId, lines)
  const previous = deps.stored(eventId)
  // The API only shows a token when it mints one; reuse ours for the same cart.
  const token =
    accessToken ?? (previous?.cartId === cart.id ? previous.token : undefined)
  if (!token) throw new Error('The cart access token was not returned.')
  deps.save(eventId, { cartId: cart.id, token })
  return { cartId: cart.id }
}
