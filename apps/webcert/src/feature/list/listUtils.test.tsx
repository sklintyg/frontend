import {
  fakeBooleanFilter,
  fakeDateRangeFilter,
  fakeOrderFilter,
  fakePageSizeFilter,
  fakePersonIdFilter,
  fakeSelectFilter,
  fakeTextFilter,
} from '../../faker/list/fakeListFilterConfig'
import { ListFilterType } from '../../types'
import { getListFilterDefaultValue, isFilterDefault, isFilterValueDefault } from './listUtils'

describe('listUtils', () => {
  describe('getListFilterDefaultValue', () => {
    it('should return empty string for text value', () => {
      const result = getListFilterDefaultValue(fakeTextFilter())
      expect(result).toEqual({ type: ListFilterType.TEXT, value: '' })
    })

    it('should return empty string for person id value', () => {
      const result = getListFilterDefaultValue(fakePersonIdFilter())
      expect(result).toEqual({ type: ListFilterType.PERSON_ID, value: '' })
    })

    it('should return id of default option for select value', () => {
      const result = getListFilterDefaultValue(fakeSelectFilter())
      expect(result).toEqual({ type: ListFilterType.SELECT, value: 'option2' })
    })

    it('should return default strings for date range value', () => {
      const result = getListFilterDefaultValue(fakeDateRangeFilter())
      expect(result).toEqual({ type: ListFilterType.DATE_RANGE, to: 'default1', from: 'default2' })
    })

    it('should return default string for order value', () => {
      const result = getListFilterDefaultValue(fakeOrderFilter())
      expect(result).toEqual({ type: ListFilterType.ORDER, value: 'defaultOrder' })
    })

    it('should return default boolean for boolean value', () => {
      const result = getListFilterDefaultValue(fakeBooleanFilter())
      expect(result).toEqual({ type: ListFilterType.BOOLEAN, value: true })
    })

    it('should return first page size for page size value', () => {
      const result = getListFilterDefaultValue(fakePageSizeFilter())
      expect(result).toEqual({ type: ListFilterType.NUMBER, value: 10 })
    })
  })

  describe('isFilterValueDefault', () => {
    it('should return true if text value is empty string', () => {
      const result = isFilterValueDefault(fakeTextFilter(), { type: ListFilterType.TEXT, value: '' })
      expect(result).toBe(true)
    })

    it('should return false if text value is not empty string', () => {
      const result = isFilterValueDefault(fakeTextFilter(), { type: ListFilterType.TEXT, value: 'test' })
      expect(result).toBe(false)
    })

    it('should return true person id is empty string', () => {
      const result = isFilterValueDefault(fakePersonIdFilter(), { type: ListFilterType.PERSON_ID, value: '' })
      expect(result).toBe(true)
    })

    it('should return false person id is not empty string', () => {
      const result = isFilterValueDefault(fakePersonIdFilter(), { type: ListFilterType.PERSON_ID, value: '191212121212' })
      expect(result).toBe(false)
    })

    it('should return true if value is id of default option', () => {
      const result = isFilterValueDefault(fakeSelectFilter(), { type: ListFilterType.SELECT, value: 'option2' })
      expect(result).toBe(true)
    })

    it('should return false if value is not id of default option', () => {
      const result = isFilterValueDefault(fakeSelectFilter(), { type: ListFilterType.SELECT, value: 'option1' })
      expect(result).toBe(false)
    })

    it('should return true if date is default value', () => {
      const result = isFilterValueDefault(fakeDateRangeFilter(), { type: ListFilterType.DATE_RANGE, to: 'default1', from: 'default2' })
      expect(result).toBe(true)
    })

    it('should return false if date is not default value', () => {
      const result = isFilterValueDefault(fakeDateRangeFilter(), { type: ListFilterType.DATE_RANGE, to: '', from: '' })
      expect(result).toBe(false)
    })

    it('should return true if default order value', () => {
      const result = isFilterValueDefault(fakeOrderFilter(), { type: ListFilterType.ORDER, value: 'defaultOrder' })
      expect(result).toBe(true)
    })

    it('should return false if not default order value', () => {
      const result = isFilterValueDefault(fakeOrderFilter(), { type: ListFilterType.ORDER, value: 'notDefaultOrder' })
      expect(result).toBe(false)
    })

    it('should return true if default boolean value', () => {
      const result = isFilterValueDefault(fakeBooleanFilter(), { type: ListFilterType.BOOLEAN, value: true })
      expect(result).toBe(true)
    })

    it('should return false if not default boolean value', () => {
      const result = isFilterValueDefault(fakeBooleanFilter(), { type: ListFilterType.BOOLEAN, value: false })
      expect(result).toBe(false)
    })

    it('should return true if first page size value', () => {
      const result = isFilterValueDefault(fakePageSizeFilter(), { type: ListFilterType.NUMBER, value: 10 })
      expect(result).toBe(true)
    })

    it('should return false if not first page size value', () => {
      const result = isFilterValueDefault(fakePageSizeFilter(), { type: ListFilterType.NUMBER, value: 20 })
      expect(result).toBe(false)
    })
  })

  describe('isFilterDefault', () => {
    it('Should return true when all filters have default value', () => {
      const result = isFilterDefault([fakeTextFilter({ id: 'SOME_FILTER' })], { SOME_FILTER: { type: ListFilterType.TEXT, value: '' } })
      expect(result).toBe(true)
    })

    it('Should return false when any filters doesnt have default value', () => {
      const result = isFilterDefault([fakeTextFilter({ id: 'SOME_FILTER' })], {
        SOME_FILTER: { type: ListFilterType.TEXT, value: 'Not default' },
      })
      expect(result).toBe(false)
    })
  })
})
