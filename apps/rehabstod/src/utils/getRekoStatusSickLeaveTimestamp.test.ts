import { addDays, format, subDays } from 'date-fns'
import { expect, it, describe } from 'vitest'
import { getRekoStatusSickLeaveTimestamp } from './getRekoStatusSickLeaveTimestamp'

describe('getRekoStatusSickLeaveTimestamp', () => {
  it('should return todays date if sick leave is active', () => {
    const today = new Date()
    expect(getRekoStatusSickLeaveTimestamp(format(addDays(today, 1), 'yyyy-MM-dd'))).toEqual(format(new Date(), 'yyyy-MM-dd'))
  })

  it('should return end date if sick leave has ended', () => {
    const today = new Date()
    const endDate = format(subDays(today, 1), 'yyyy-MM-dd')
    expect(getRekoStatusSickLeaveTimestamp(endDate)).toEqual(endDate)
  })
})
