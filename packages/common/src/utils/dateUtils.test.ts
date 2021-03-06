import { isEqual } from 'date-fns'
import {
  getValidDate,
  getLatestPeriodEndDate,
  CertificateDataValueType,
  getPeriodHasOverlap,
  getPeriodWorkHours,
  ConfigUeCheckboxDateRange,
  ValueDateRange,
} from '@frontend/common'
import { filterDateRangeValueList, getNumberOfSickLeavePeriodDays, getPeriodWorkDays, SickLeavePeriods } from './dateUtils'

const QUESTION_ID = 'Test'

const EN_FJARDEDEL_ID = 'EN_FJARDEDEL'
const EN_FJARDEDEL_LABEL = '25 procent'

const HALFTEN_ID = 'HALFTEN'
const HALFTEN_LABEL = '50 procent'

const TRE_FJARDEDEL_ID = 'TRE_FJARDEDEL'
const TRE_FJARDEDEL_LABEL = '75 procent'

const HELT_NEDSATT_ID = 'HELT_NEDSATT'
const HELT_NEDSATT_LABEL = '100 procent'

const configList: ConfigUeCheckboxDateRange[] = [
  //@ts-ignore Skipping additional data for tests
  {
    id: EN_FJARDEDEL_ID,
    label: EN_FJARDEDEL_LABEL,
  },
  //@ts-ignore Skipping additional data for tests
  {
    id: HALFTEN_ID,
    label: HALFTEN_LABEL,
  },
  //@ts-ignore Skipping additional data for tests
  {
    id: TRE_FJARDEDEL_ID,
    label: TRE_FJARDEDEL_LABEL,
  },
  //@ts-ignore Skipping additional data for tests
  {
    id: HELT_NEDSATT_ID,
    label: HELT_NEDSATT_LABEL,
  },
]

describe('Date utils tests', () => {
  it('get valid date with valid dashes string', () => {
    const validDateStringDashes = '2021-04-08'
    const date = getValidDate(validDateStringDashes)
    expect(date).toBeTruthy()
  })

  it('get valid date without dashes string', () => {
    const validDateString = '20210408'
    const date = getValidDate(validDateString)
    // console.log(date)
    expect(date).toBeTruthy()
  })

  it('gets correct period end date with one prior period', () => {
    const toDate = '2021-04-20'
    const valueList: ValueDateRange[] = [{ id: EN_FJARDEDEL_ID, from: '2021-04-20', to: toDate, type: CertificateDataValueType.DATE_RANGE }]
    const date = getLatestPeriodEndDate(configList, valueList)
    const expectedDate = getValidDate(toDate)

    expect(date).toBeTruthy()
    expect(isEqual(date!, expectedDate!)).toBeTruthy()
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
    expect(isEqual(date!, expectedDate!)).toBeTruthy()
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
  const expected = 30.0

  const actual = getPeriodWorkHours(40, sickLeavePercentage)

  expect(actual).toBe(expected)
})

it('Calculates 50% sick leave correctly', () => {
  const sickLeavePercentage = SickLeavePeriods.HALFTEN
  const expected = 20.0

  const actual = getPeriodWorkHours(40, sickLeavePercentage)

  expect(actual).toBe(expected)
})

it('Calculates 75% sick leave correctly', () => {
  const sickLeavePercentage = SickLeavePeriods.TRE_FJARDEDEL
  const expected = 10.0

  const actual = getPeriodWorkHours(40, sickLeavePercentage)

  expect(actual).toBe(expected)
})

it('Calculates 100% sick leave correctly', () => {
  const sickLeavePercentage = SickLeavePeriods.HELT_NEDSATT
  const expected = 0.0

  const actual = getPeriodWorkHours(40, sickLeavePercentage)

  expect(actual).toBe(expected)
})

it('Calculates uneven number sick leave correctly', () => {
  const sickLeavePercentage = SickLeavePeriods.EN_FJARDEDEL
  const expected = 12.75

  const actual = getPeriodWorkHours(17, sickLeavePercentage)

  expect(actual).toBe(expected)
})

it('Calculates 1 week of sick days correctly', () => {
  const fromDate = getValidDate('2021-06-20')
  const toDate = getValidDate('2021-06-26')

  const expected = 7
  const actual = getPeriodWorkDays(fromDate!, toDate!)

  expect(actual).toBe(expected)
})

it('Calculates 1 sick day correctly', () => {
  const fromDate = getValidDate('2021-06-20')
  const toDate = getValidDate('2021-06-20')

  const expected = 1
  const actual = getPeriodWorkDays(fromDate!, toDate!)

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
  const actual = getNumberOfSickLeavePeriodDays(periods)

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
      from: null!,
      to: '2021-05-20',
      id: '',
      type: CertificateDataValueType.DATE_RANGE,
    },
    {
      from: undefined!,
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
