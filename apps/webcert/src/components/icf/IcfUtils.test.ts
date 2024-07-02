import { fakeIcfCode, fakeIcfCodeCollection, fakeIcfCollection } from '../../faker'
import type { AvailableIcfCodes } from '../../store/icf/icfReducer'
import { getFilteredIcfValues, getIcfValueList } from './IcfUtils'

function getIcfData(): AvailableIcfCodes {
  const icfCodes = Array.from({ length: 3 }, (_, index) => fakeIcfCode({ title: `${index}` }))
  return fakeIcfCollection({
    commonCodes: fakeIcfCodeCollection({ icfCodes }),
    uniqueCodes: [fakeIcfCodeCollection({ icfCodes })],
  })
}

describe('IcfUtils', () => {
  describe('getIcfValues', () => {
    it('shall return empty array if no values', () => {
      const actual = getIcfValueList(undefined)

      expect(actual).toEqual([])
    })

    it('shall return array with all values', () => {
      const icfData = getIcfData()
      const actual = getIcfValueList(icfData)
      const expectedArrayLength = 6
      expect(actual.length).toEqual(expectedArrayLength)
    })
  })

  describe('getFilteredIcfValues', () => {
    it('shall return empty array if no values', () => {
      const actual = getFilteredIcfValues([], [], [])

      expect(actual).toEqual([])
    })

    it('shall return filtered chosen values', () => {
      const oldIcfValues = ['0', '1', '2', '3']
      const newIcfValues = ['0', '2']
      const chosenIcfValues = [...oldIcfValues]
      const actual = getFilteredIcfValues(chosenIcfValues, oldIcfValues, newIcfValues)

      expect(actual).toEqual(newIcfValues)
    })
  })
})
