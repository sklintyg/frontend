import { fakerFromSchema } from '@frontend/fake'
import { TimePeriodMetric, timePeriodOptionSchema } from '../../../schemas/timePeriodOptionSchema'
import { getSickLeaveLengthPlaceholder } from './getSickLeaveLengthPlaceholder'

it('Should return Alla valda if nothing is selected', () => {
  expect(getSickLeaveLengthPlaceholder([])).toBe('Alla valda')
})

describe('One selected', () => {
  it('Should treat from 0 as normal value', () => {
    expect(
      getSickLeaveLengthPlaceholder([
        {
          from: 0,
          to: 14,
          metric: TimePeriodMetric.DAYS,
          id: 1,
        },
      ])
    ).toBe('0-14 dagar')
  })

  it('Should print between when from and to has values', () => {
    expect(
      getSickLeaveLengthPlaceholder([
        {
          from: 91,
          to: 180,
          metric: TimePeriodMetric.DAYS,
          id: 4,
        },
      ])
    ).toBe('91-180 dagar')
  })

  it('Should print "Över" when to is zero', () => {
    expect(
      getSickLeaveLengthPlaceholder([
        {
          from: 2,
          to: null,
          metric: TimePeriodMetric.YEARS,
          id: 7,
        },
      ])
    ).toBe('Över 2 år')
  })
})

it('Should return number of selected when more then one', () => {
  expect(getSickLeaveLengthPlaceholder(Array.from({ length: 2 }, fakerFromSchema(timePeriodOptionSchema)))).toBe('2 valda')
})
