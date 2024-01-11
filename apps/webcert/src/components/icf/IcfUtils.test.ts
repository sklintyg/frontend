import { fakeIcf } from '@frontend/common'
import { expect, it, describe } from 'vitest'
import { getFilteredIcfValues, getIcfValueList } from './IcfUtils'
import { AvailableIcfCodes } from '../../store/icf/icfReducer'

function getIcfData(): AvailableIcfCodes {
  const icfCodes = Array.from({ length: 3 }, (_, index) => fakeIcf.code({ title: `${index}` }))
  return fakeIcf.collection({
    commonCodes: fakeIcf.group({ icfCodes }),
    uniqueCodes: [fakeIcf.group({ icfCodes })],
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
