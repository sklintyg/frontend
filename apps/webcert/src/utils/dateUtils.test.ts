import { addDays } from 'date-fns'

import type { ConfigUeCheckboxDateRange, ValueDateRange } from '../types/certificate';
import { CertificateDataValueType } from '../types/certificate'
import {
  SickLeavePeriods,
  filterDateRangeValueList,
  formatDate,
  getLatestPeriodEndDate,
  getNumberOfPeriodDays,
  getPeriodHasOverlap,
  getPeriodWorkDays,
  getPeriodWorkHours,
  getValidDate,
  getValidDateFormat,
  isDateRangeValid,
  isDateRangeValidOrIncomplete,
  isFutureDate,
} from './dateUtils'

const EN_FJARDEDEL_ID = 'EN_FJARDEDEL'
const EN_FJARDEDEL_LABEL = '25 procent'

const HALFTEN_ID = 'HALFTEN'
const HALFTEN_LABEL = '50 procent'

const TRE_FJARDEDEL_ID = 'TRE_FJARDEDEL'
const TRE_FJARDEDEL_LABEL = '75 procent'

const HELT_NEDSATT_ID = 'HELT_NEDSATT'
const HELT_NEDSATT_LABEL = '100 procent'

const configList: ConfigUeCheckboxDateRange[] = [
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Skipping additional data for tests
  {
    id: EN_FJARDEDEL_ID,
    label: EN_FJARDEDEL_LABEL,
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Skipping additional data for tests
  {
    id: HALFTEN_ID,
    label: HALFTEN_LABEL,
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Skipping additional data for tests
  {
    id: TRE_FJARDEDEL_ID,
    label: TRE_FJARDEDEL_LABEL,
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Skipping additional data for tests
  {
    id: HELT_NEDSATT_ID,
    label: HELT_NEDSATT_LABEL,
  },
]

describe('Date utils tests', () => {
  it('get valid date with valid dashes string', () => {
    const validDateStringDashes = '2021-04-08'
    const date = getValidDateFormat(validDateStringDashes)
    expect(date).toEqual(new Date(2021, 3, 8))
  })

  it('get valid date without dashes string', () => {
    const validDateString = '20210408'
    const date = getValidDateFormat(validDateString)
    // console.log(date)
    expect(date).toEqual(new Date(2021, 3, 8))
  })

  it('get reasonable 2099-12-12 date with valid dashes string', () => {
    const validDateStringDashes = '2099-12-12'
    const date = getValidDate(validDateStringDashes)
    expect(date).toEqual(new Date(2099, 11, 12))
  })

  it('get unreasonable 2099-12-13 date with valid dashes string', () => {
    const validDateStringDashes = '2099-12-13'
    const date = getValidDate(validDateStringDashes)
    expect(date).toBeUndefined()
  })

  it('get reasonable 1900-01-02 date with valid dashes string', () => {
    const validDateStringDashes = '1900-01-02'
    const date = getValidDate(validDateStringDashes)
    expect(date).toEqual(new Date(1900, 0, 2))
  })

  it('get unreasonable 1900-01-01 date with valid dashes string', () => {
    const validDateStringDashes = '1900-01-01'
    const date = getValidDate(validDateStringDashes)
    expect(date).toBeUndefined()
  })

  it('get unreasonable 1200 date with valid dashes string', () => {
    const validDateStringDashes = '1212-12-12'
    const date = getValidDate(validDateStringDashes)
    expect(date).toBeUndefined()
  })

  it('get unreasonable 1200 date without valid dashes string', () => {
    const validDateStringDashes = '12121212'
    const date = getValidDate(validDateStringDashes)
    expect(date).toBeUndefined()
  })

  it('gets correct period end date with one prior period', () => {
    const toDate = '2021-04-20'
    const valueList: ValueDateRange[] = [{ id: EN_FJARDEDEL_ID, from: '2021-04-20', to: toDate, type: CertificateDataValueType.DATE_RANGE }]
    const date = getLatestPeriodEndDate(configList, valueList)
    const expectedDate = getValidDate(toDate)

    expect(date).toBeTruthy()
    expect(date).toEqual(expectedDate)
  })

  it('gets correct period end date with multiple prior periods', () => {
    const firstPeriod: ValueDateRange = {
      id: EN_FJARDEDEL_ID,
      from: '2021-04-10',
      to: '2021-04-15',
      type: CertificateDataValueType.DATE_RANGE,
    }
    const secondPeriod: ValueDateRange = {
      id: HALFTEN_ID,
      from: '2021-04-16',
      to: '2021-04-20',
      type: CertificateDataValueType.DATE_RANGE,
    }

    const valueList: ValueDateRange[] = [firstPeriod, secondPeriod]

    const date = getLatestPeriodEndDate(configList, valueList)
    const expectedDate = getValidDate(secondPeriod.to)

    expect(date).toBeTruthy()
    expect(date).toEqual(expectedDate)
  })
})

it('returns true if dates are between other period', () => {
  const sutId = 'sutId'
  const valueList: ValueDateRange[] = [
    { id: sutId, from: '2021-06-05', to: '2021-06-06', type: CertificateDataValueType.DATE_RANGE },
    { id: '2', from: '2021-06-01', to: '2021-06-11', type: CertificateDataValueType.DATE_RANGE },
  ]

  const expected = true
  const actual = getPeriodHasOverlap(valueList, sutId)

  expect(actual).toBe(expected)
})

it('returns true if dates are same as other period', () => {
  const sutId = 'sutId'
  const valueList: ValueDateRange[] = [
    { id: sutId, from: '2021-06-01', to: '2021-06-10', type: CertificateDataValueType.DATE_RANGE },
    { id: '2', from: '2021-06-01', to: '2021-06-10', type: CertificateDataValueType.DATE_RANGE },
  ]

  const expected = true
  const actual = getPeriodHasOverlap(valueList, sutId)

  expect(actual).toBe(expected)
})

it('returns false if dates are not overlapping', () => {
  const sutId = 'sutId'
  const valueList: ValueDateRange[] = [
    { id: sutId, from: '2021-06-01', to: '2021-06-10', type: CertificateDataValueType.DATE_RANGE },
    { id: '2', from: '2021-06-11', to: '2021-06-15', type: CertificateDataValueType.DATE_RANGE },
  ]

  const expected = false
  const actual = getPeriodHasOverlap(valueList, sutId)

  expect(actual).toBe(expected)
})

it('Calculates 25% sick leave correctly', () => {
  const sickLeavePercentage = SickLeavePeriods.EN_FJARDEDEL
  const expected = '30'

  const actual = getPeriodWorkHours(40, sickLeavePercentage)

  expect(actual).toBe(expected)
})

it('Calculates 50% sick leave correctly', () => {
  const sickLeavePercentage = SickLeavePeriods.HALFTEN
  const expected = '20'

  const actual = getPeriodWorkHours(40, sickLeavePercentage)

  expect(actual).toBe(expected)
})

it('Calculates 75% sick leave correctly', () => {
  const sickLeavePercentage = SickLeavePeriods.TRE_FJARDEDEL
  const expected = '10'

  const actual = getPeriodWorkHours(40, sickLeavePercentage)

  expect(actual).toBe(expected)
})

it('Calculates 100% sick leave correctly', () => {
  const sickLeavePercentage = SickLeavePeriods.HELT_NEDSATT
  const expected = 0

  const actual = getPeriodWorkHours(40, sickLeavePercentage)

  expect(actual).toBe(expected)
})

it('Calculates uneven number sick leave correctly', () => {
  const sickLeavePercentage = SickLeavePeriods.EN_FJARDEDEL
  const expected = '12,75'

  const actual = getPeriodWorkHours(17, sickLeavePercentage)

  expect(actual).toBe(expected)
})

it('Calculates 1 week of sick days correctly', () => {
  const fromDate = new Date('2021-06-20')
  const toDate = new Date('2021-06-26')

  const expected = 7
  const actual = getPeriodWorkDays(fromDate, toDate)

  expect(actual).toBe(expected)
})

it('Calculates 1 sick day correctly', () => {
  const fromDate = new Date('2021-06-20')
  const toDate = new Date('2021-06-20')

  const expected = 1
  const actual = getPeriodWorkDays(fromDate, toDate)

  expect(actual).toBe(expected)
})

it('calculates multiple periods of sick leave days correctly', () => {
  const periods: ValueDateRange[] = [
    {
      from: '2021-06-29',
      to: '2021-07-05',
      id: '',
      type: CertificateDataValueType.DATE_RANGE,
    },
    {
      from: '2021-07-06',
      to: '2021-07-12',
      id: '',
      type: CertificateDataValueType.DATE_RANGE,
    },
  ]

  const expected = 14
  const actual = getNumberOfPeriodDays(periods)

  expect(actual).toBe(expected)
})

it('Filters date range value list correctly', () => {
  const valueList: ValueDateRange[] = [
    {
      from: '2021-05-12',
      to: '',
      id: '',
      type: CertificateDataValueType.DATE_RANGE,
    },
    {
      from: undefined,
      to: '2021-05-20',
      id: '',
      type: CertificateDataValueType.DATE_RANGE,
    },
    {
      from: undefined,
      to: '',
      id: '',
      type: CertificateDataValueType.DATE_RANGE,
    },
    {
      from: '2021-',
      to: 'x',
      id: '',
      type: CertificateDataValueType.DATE_RANGE,
    },
  ]

  const filteredValues = filterDateRangeValueList(valueList)

  expect(filteredValues[0].from).toEqual('2021-05-12')
  expect(filteredValues[0].to).toBe(undefined)
  expect(filteredValues[1].from).toBe(undefined)
  expect(filteredValues[1].to).toEqual('2021-05-20')
  expect(filteredValues[2]).toBe(undefined)
  expect(filteredValues.length).toBe(2)
  expect(filteredValues[3]).toBe(undefined)
})

describe('isDateRangeValid', () => {
  it('returns true if both dates are valid', () => {
    const fromDate = '2021-11-22'
    const toDate = '2021-11-23'

    const actual = isDateRangeValid(fromDate, toDate)

    expect(actual).toBe(true)
  })

  it('returns false if from date is invalid', () => {
    const fromDate = '2021-11-'
    const toDate = '2021-11-23'

    const actual = isDateRangeValid(fromDate, toDate)

    expect(actual).toBe(false)
  })

  it('returns false if to date is invalid', () => {
    const fromDate = '2021-11-22'
    const toDate = '2021-11-'

    const actual = isDateRangeValid(fromDate, toDate)

    expect(actual).toBe(false)
  })

  it('returns false if both dates are valid and to date is before from date', () => {
    const fromDate = '2021-11-22'
    const toDate = '2021-11-21'

    const actual = isDateRangeValid(fromDate, toDate)

    expect(actual).toBe(false)
  })
})

describe('isFutureDate', () => {
  it('should return false if date is invalid', () => {
    const date = '2021'

    const actual = isFutureDate(date)

    expect(actual).toBeFalsy()
  })

  it('should return true if date is in future', () => {
    const dateString = addDays(new Date(), 2).toISOString().slice(0, 10)
    const actual = isFutureDate(dateString)

    expect(actual).toBeTruthy()
  })

  it('should return false if date is not in future', () => {
    const date = '2020-02-02'

    const actual = isFutureDate(date)

    expect(actual).toBeFalsy()
  })

  it('should return false if date is today', () => {
    const date = new Date().toISOString().slice(0, 10)

    const actual = isFutureDate(date)

    expect(actual).toBeFalsy()
  })
})

describe('isDateRangeValidOrIncomplete', () => {
  it('should return true if from date is invalid', () => {
    const fromDate = '2021'
    const toDate = '2021-02-02'

    const actual = isDateRangeValidOrIncomplete(fromDate, toDate)

    expect(actual).toBeTruthy()
  })

  it('should return true if to date is invalid', () => {
    const toDate = '2021'
    const fromDate = '2021-02-02'

    const actual = isDateRangeValidOrIncomplete(fromDate, toDate)

    expect(actual).toBeTruthy()
  })

  it('should return true if from is before to', () => {
    const toDate = '2021-03-03'
    const fromDate = '2021-02-02'

    const actual = isDateRangeValidOrIncomplete(fromDate, toDate)

    expect(actual).toBeTruthy()
  })

  it('should return false if from is after to', () => {
    const toDate = '2021-01-01'
    const fromDate = '2021-02-02'

    const actual = isDateRangeValidOrIncomplete(fromDate, toDate)

    expect(actual).toBeFalsy()
  })
})

describe('Format date', () => {
  it('should return original date if it does not include time', () => {
    const date = '2020-02-02'
    const actual = formatDate(date)
    expect(actual).toEqual(date)
  })

  it('should return date with formatted time', () => {
    const date = '2020-02-02T00:00:00'
    const actual = formatDate(date)
    expect(actual).toEqual('2020-02-02 00:00')
  })
})
