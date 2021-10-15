import { getFilteredIcfValues, isOldListIncludedInNewList, getIcfValueList } from './IcfUtils'
import { AvailableIcfCodes, IcfCode } from '../../store/icf/icfReducer'

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

  describe('getHasNewIcfValues', () => {
    it('shall return false if no difference in arrays', () => {
      const oldIcfValues = ['0', '1']
      const newIcfValues = ['0', '1']

      const actual = isOldListIncludedInNewList(oldIcfValues, newIcfValues)

      expect(actual).toBe(false)
    })

    it('shall return true if difference in arrays', () => {
      const oldIcfValues = ['0', '1', '2']
      const newIcfValues = ['1', '2']

      const actual = isOldListIncludedInNewList(oldIcfValues, newIcfValues)

      expect(actual).toBe(true)
    })
  })
})

function getIcfData(): AvailableIcfCodes {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const icfCodes: IcfCode[] = [{ title: '0' }, { title: '1' }, { title: '2' }]
  return {
    uniqueCodes: [{ icfCodes: icfCodes }],
    commonCodes: { icfCodes: icfCodes },
  } as AvailableIcfCodes
}
