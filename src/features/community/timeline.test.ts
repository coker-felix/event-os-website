import type { BlueprintTask } from './types'
import { describe, expect, it } from 'vitest'
import { offsetLabel, orderTasks } from './timeline'
const task = (key: string, dependsOn: string[] = []): BlueprintTask => ({ key, title: key, dependsOn, offsetAmount: 0, offsetUnit: 'calendar_days', weekendPolicy: '', leadDays: 0 })
describe('blueprint timeline', () => {
  it('orders dependencies first and otherwise preserves input order', () => {
    expect(orderTasks([task('c', ['a']), task('b'), task('a')]).map(x => x.key)).toEqual(['b', 'a', 'c'])
  })
  it('falls back to input order on a cycle', () => {
    const input = [task('a', ['b']), task('b', ['a'])]
    expect(orderTasks(input)).toEqual(input)
  })
  it('formats offsets', () => {
    expect(offsetLabel(6, 'calendar_weeks')).toBe('6 weeks before')
    expect(offsetLabel(6, 'calendar_days')).toBe('6 days before')
    expect(offsetLabel(3, 'business_days')).toBe('3 business days before')
    expect(offsetLabel(0, 'calendar_days')).toBe('On the day')
  })
})
