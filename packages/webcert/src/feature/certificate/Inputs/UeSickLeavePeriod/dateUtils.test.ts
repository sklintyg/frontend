import { isEqual } from 'date-fns'
import { ConfigUeCheckboxDateRange, ValueDateRange } from './../../../../../../common/src/types/certificate'
import { getValidDate, getLatestPeriodEndDate, ValueDateRangeList, CertificateDataValueType } from '@frontend/common'

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
    const date = getLatestPeriodEndDate(configList, valueList, HELT_NEDSATT_ID)
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

    const date = getLatestPeriodEndDate(configList, valueList, HELT_NEDSATT_ID)
    const expectedDate = getValidDate(secondPeriod.to)

    expect(date).toBeTruthy()
    expect(isEqual(date!, expectedDate!)).toBeTruthy()
  })
})
