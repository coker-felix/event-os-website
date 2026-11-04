import { describe, expect, it } from 'vitest'
import { categoriesOfPosts, splitFeatured } from './utils'
import type { BlogPost } from './types'

const post = (id: string, category?: string): BlogPost => ({
  id,
  slug: id,
  title: `Post ${id}`,
  category,
})

describe('categoriesOfPosts', () => {
  it('lists each category once, in the order first seen', () => {
    const posts = [post('1', 'Guides'), post('2', 'Vendors'), post('3', 'Guides'), post('4', 'News')]
    expect(categoriesOfPosts(posts)).toEqual(['Guides', 'Vendors', 'News'])
  })

  it('skips posts with no category and handles an empty list', () => {
    expect(categoriesOfPosts([post('1'), post('2', 'Guides')])).toEqual(['Guides'])
    expect(categoriesOfPosts([])).toEqual([])
  })
})

describe('splitFeatured', () => {
  it('has no featured post for an empty list', () => {
    expect(splitFeatured([])).toEqual({ featured: undefined, rest: [] })
  })

  it('makes the first post the featured one and keeps the rest in order', () => {
    const posts = [post('1'), post('2'), post('3')]
    const out = splitFeatured(posts)
    expect(out.featured?.id).toBe('1')
    expect(out.rest.map((p) => p.id)).toEqual(['2', '3'])
  })

  it('does not change the list it was given', () => {
    const posts = [post('1'), post('2')]
    splitFeatured(posts)
    expect(posts).toHaveLength(2)
  })
})
