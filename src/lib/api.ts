const API_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
).replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  /** Parsed JSON body of the error response, or null when there was none. */
  body: unknown
  constructor(status: number, message: string, body: unknown = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

interface ApiFetchOptions {
  signal?: AbortSignal
  /** Abort the request after this many ms. Default 8000. */
  timeoutMs?: number
}

export interface ApiRequestOptions extends ApiFetchOptions {
  body?: unknown
  headers?: Record<string, string>
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

async function readBody(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/** Call the EventRail API. Resolves with the parsed body, or `null` for an empty one. */
export async function apiRequest<T = null>(
  method: Method,
  path: string,
  { body, headers, signal, timeoutMs = 60_000 }: ApiRequestOptions = {},
): Promise<T> {
  const timeout = AbortSignal.timeout(timeoutMs)
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  })
  if (!res.ok) {
    throw new ApiError(res.status, `${method} ${path} failed`, await readBody(res))
  }
  return (await readBody(res)) as T
}

/** GET a JSON resource from the EventRail API. */
export function apiGet<T>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
  return apiRequest<T>('GET', path, opts)
}

/** POST a JSON body to the EventRail API. */
export function apiPost<T = null>(
  path: string,
  body: unknown,
  opts: ApiFetchOptions = {},
): Promise<T> {
  return apiRequest<T>('POST', path, { ...opts, body })
}
