import { describe, expect, it } from 'vitest'
import { resolvePageState } from './state'

describe('resolvePageState', () => {
  it('returns off only for a loaded disabled status', () => {
    expect(resolvePageState({ data: { blueprints: false } })).toBe('off')
    expect(resolvePageState({ data: { blueprints: true } })).toBe('ready')
  })
  it('returns down when status request failed', () => {
    expect(resolvePageState({ error: new Error('offline') })).toBe('down')
  })
})
