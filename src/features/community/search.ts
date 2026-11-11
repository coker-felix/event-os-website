import { isUuid } from './ids'

export interface BlueprintsSearch {
  q?: string
  tag?: string
  sort?: 'forks' | 'recent'
  author?: string
  page?: number
}

function text(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value === 'string' && value.trim()) return value.trim()
  return undefined
}

function page(value: unknown): number | undefined {
  const number = typeof value === 'string' || typeof value === 'number' ? Number(value) : NaN
  return Number.isInteger(number) && number > 1 ? number : undefined
}

export function validateBlueprintsSearch(raw: Record<string, unknown>): BlueprintsSearch {
  const result: BlueprintsSearch = {}
  const q = text(raw.q)
  if (q) result.q = q
  const tag = text(raw.tag)
  if (tag) result.tag = tag
  if (raw.sort === 'forks' || raw.sort === 'recent') result.sort = raw.sort
  const author = text(raw.author)
  if (author && isUuid(author)) result.author = author
  const currentPage = page(raw.page)
  if (currentPage) result.page = currentPage
  return result
}
