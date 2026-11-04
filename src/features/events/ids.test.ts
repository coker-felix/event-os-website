import { describe, expect, it } from 'vitest'
import { isEventId } from './ids'

describe('isEventId', () => {
  it('accepts a UUID in either case', () => {
    expect(isEventId('0bf0230a-413e-4897-8f00-4c48ec2a3315')).toBe(true)
    expect(isEventId('0BF0230A-413E-4897-8F00-4C48EC2A3315')).toBe(true)
  })

  it('rejects anything that is not a UUID', () => {
    expect(isEventId('does-not-exist')).toBe(false)
    expect(isEventId('')).toBe(false)
    expect(isEventId('0bf0230a-413e-4897-8f00-4c48ec2a331')).toBe(false)
    expect(isEventId("0bf0230a-413e-4897-8f00-4c48ec2a3315'; drop")).toBe(false)
  })
})
