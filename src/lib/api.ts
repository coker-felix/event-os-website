const API_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
).replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface ApiFetchOptions {
  signal?: AbortSignal
  /** Abort the request after this many ms. Default 8000. */
  timeoutMs?: number
}

/** GET a JSON resource from the Event OS API. */
export async function apiGet<T>(
  path: string,
  { signal, timeoutMs = 8000 }: ApiFetchOptions = {},
): Promise<T> {
  const timeout = AbortSignal.timeout(timeoutMs)
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Accept: 'application/json' },
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  })
  if (!res.ok) throw new ApiError(res.status, `GET ${path} failed`)
  return (await res.json()) as T
}

/** POST a JSON body to the Event OS API. Resolves with the parsed body, or `null` for empty responses. */
export async function apiPost<T = null>(
  path: string,
  body: unknown,
  { signal, timeoutMs = 8000 }: ApiFetchOptions = {},
): Promise<T> {
  const timeout = AbortSignal.timeout(timeoutMs)
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  })
  if (!res.ok) throw new ApiError(res.status, `POST ${path} failed`)
  const text = await res.text()
  return (text ? JSON.parse(text) : null) as T
}
