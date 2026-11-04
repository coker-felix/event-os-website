import { describe, expect, it } from 'vitest'
import { nextTab } from './tabs'

describe('nextTab', () => {
  it('moves right and left, wrapping around', () => {
    expect(nextTab(0, 'ArrowRight', 3)).toBe(1)
    expect(nextTab(2, 'ArrowRight', 3)).toBe(0)
    expect(nextTab(0, 'ArrowLeft', 3)).toBe(2)
    expect(nextTab(2, 'ArrowLeft', 3)).toBe(1)
  })
  it('jumps to the ends with Home and End', () => {
    expect(nextTab(1, 'Home', 3)).toBe(0)
    expect(nextTab(1, 'End', 3)).toBe(2)
  })
  it('ignores other keys and empty lists', () => {
    expect(nextTab(1, 'a', 3)).toBeNull()
    expect(nextTab(0, 'ArrowRight', 0)).toBeNull()
  })
})
