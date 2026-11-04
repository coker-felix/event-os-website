import { describe, expect, it } from 'vitest'
import { visibleStats } from './visible'

const s = (value: number | null | undefined, label = 'x') => ({ value, label, group: 'g' })

describe('visibleStats', () => {
  it('drops missing, zero, negative and non-finite values', () => {
    expect(
      visibleStats([s(null), s(undefined), s(0), s(-3), s(NaN), s(Infinity)]),
    ).toEqual([])
  })
  it('keeps real positive numbers, in order', () => {
    expect(visibleStats([s(5, 'a'), s(0, 'b'), s(12, 'c')]).map((x) => x.label)).toEqual(['a', 'c'])
  })
})
