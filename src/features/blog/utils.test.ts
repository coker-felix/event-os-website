import { describe, expect, it } from 'vitest'
import {
  articleParagraphs,
  categoriesOfPosts,
  isPostSlug,
  relatedPosts,
  splitFeatured,
} from './utils'
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

describe('articleParagraphs', () => {
  it('splits on blank lines, trims and drops empties', () => {
    expect(articleParagraphs('a\n\n\n b \n\nc')).toEqual(['a', 'b', 'c'])
  })

  it('keeps a single line break inside a paragraph', () => {
    expect(articleParagraphs('line one\nline two\n\nnext')).toEqual([
      'line one\nline two',
      'next',
    ])
  })

  it('gives nothing for an empty or whitespace-only body', () => {
    expect(articleParagraphs('')).toEqual([])
    expect(articleParagraphs('  \n\n  ')).toEqual([])
  })
})

describe('relatedPosts', () => {
  const posts = [
    post('1', 'Guides'),
    post('2', 'Vendors'),
    post('3', 'Guides'),
    post('4', 'Venues'),
    post('5', 'Guides'),
  ]

  it('never includes the current post', () => {
    expect(relatedPosts(posts, posts[0]).map((p) => p.id)).not.toContain('1')
  })

  it('puts the same category first, then the rest in order', () => {
    expect(relatedPosts(posts, posts[0], 4).map((p) => p.id)).toEqual(['3', '5', '2', '4'])
  })

  it('returns at most n, three by default', () => {
    expect(relatedPosts(posts, posts[0])).toHaveLength(3)
    expect(relatedPosts(posts, posts[0], 1)).toHaveLength(1)
  })

  it('copes with too few posts', () => {
    expect(relatedPosts([posts[0]], posts[0])).toEqual([])
  })
})

describe('isPostSlug', () => {
  it('accepts lowercase words joined by hyphens', () => {
    expect(isPostSlug('first-timers-guide-to-buying-tickets')).toBe(true)
    expect(isPostSlug('post-2')).toBe(true)
  })

  it('rejects anything else', () => {
    expect(isPostSlug('')).toBe(false)
    expect(isPostSlug('../etc/passwd')).toBe(false)
    expect(isPostSlug('has space')).toBe(false)
    expect(isPostSlug('a?b=c')).toBe(false)
  })
})
