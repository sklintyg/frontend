import { getListFilterDefaultValue, isFilterValuesValid } from '../listUtils'
import {
  ListFilterBooleanConfig,
  ListFilterDateRangeConfig,
  ListFilterOrderConfig,
  ListFilterPageSizeConfig,
  ListFilterPersonIdConfig,
  ListFilterSelectConfig,
  ListFilterTextConfig,
  ListFilterType,
} from '@frontend/common/src/types/list'

describe('listUtils', () => {
  describe('isFilterValuesValid', () => {
    it('should return true if filter values is undefined', () => {
      const result = isFilterValuesValid(undefined)
      expect(result).toBeTruthy()
    })

    it('should return true if filter values is empty', () => {
      const result = isFilterValuesValid({})
      expect(result).toBeTruthy()
    })

    it('should return true if filter values contains valid person id', () => {
      const values = {
        PERSON_ID: {
          type: ListFilterType.PERSON_ID,
          value: '191212121212',
        },
      }
      const result = isFilterValuesValid(values)
      expect(result).toBeTruthy()
    })

    it('should return false if filter values contains invalid person id', () => {
      const values = {
        PERSON_ID: {
          type: ListFilterType.PERSON_ID,
          value: '1912121212',
        },
      }
      const result = isFilterValuesValid(values)
      expect(result).toBeFalsy()
    })
  })

  describe('getListFilterDefaultValue', () => {
    it('should return empty string for text value', () => {
      const result = getListFilterDefaultValue(getTextFilter())
      expect(result).toEqual({ type: ListFilterType.TEXT, value: '' })
    })

    it('should return empty string for person id value', () => {
      const result = getListFilterDefaultValue(getPersonIdFilter())
      expect(result).toEqual({ type: ListFilterType.PERSON_ID, value: '' })
    })

    it('should return id of default option for select value', () => {
      const result = getListFilterDefaultValue(getSelectFilter())
      expect(result).toEqual({ type: ListFilterType.SELECT, value: 'option2' })
    })

    it('should return empty strings for date range value', () => {
      const result = getListFilterDefaultValue(getDateRangeFilter())
      expect(result).toEqual({ type: ListFilterType.DATE_RANGE, to: '', from: '' })
    })

    it('should return default string for order value', () => {
      const result = getListFilterDefaultValue(getOrderFilter())
      expect(result).toEqual({ type: ListFilterType.ORDER, value: 'defaultOrder' })
    })

    it('should return default boolean for boolean value', () => {
      const result = getListFilterDefaultValue(getBooleanFilter())
      expect(result).toEqual({ type: ListFilterType.BOOLEAN, value: true })
    })

    it('should return first page size for page size value', () => {
      const result = getListFilterDefaultValue(getPageSizeFilter())
      expect(result).toEqual({ type: ListFilterType.NUMBER, value: 10 })
    })
  })
})

export const getPageSizeFilter = (): ListFilterPageSizeConfig => {
  return {
    type: ListFilterType.PAGESIZE,
    id: 'PAGE_SIZE_FILTER',
    title: 'title',
    pageSizes: [10, 20, 50, 100],
  }
}

export const getTextFilter = (): ListFilterTextConfig => {
  return {
    type: ListFilterType.TEXT,
    id: 'TEXT_FILTER',
    title: 'title',
    placeholder: 'test',
  }
}

export const getBooleanFilter = (): ListFilterBooleanConfig => {
  return {
    type: ListFilterType.BOOLEAN,
    id: 'TEXT_FILTER',
    title: 'title',
    defaultValue: true,
  }
}

export const getPersonIdFilter = (): ListFilterPersonIdConfig => {
  return {
    type: ListFilterType.PERSON_ID,
    id: 'PERSON_FILTER',
    title: 'title',
    placeholder: 'test',
  }
}

export const getSelectFilter = (): ListFilterSelectConfig => {
  return {
    type: ListFilterType.SELECT,
    id: 'PERSON_FILTER',
    title: 'title',
    values: [
      { id: 'option1', name: 'option1', defaultValue: false },
      { id: 'option2', name: 'option2', defaultValue: true },
    ],
  }
}

export const getDateRangeFilter = (): ListFilterDateRangeConfig => {
  return {
    type: ListFilterType.DATE_RANGE,
    id: 'PERSON_FILTER',
    title: 'title',
    to: {
      type: ListFilterType.DATE,
      id: 'to',
      title: 'to',
    },
    from: {
      type: ListFilterType.DATE,
      id: 'to',
      title: 'to',
    },
  }
}

export const getOrderFilter = (): ListFilterOrderConfig => {
  return {
    type: ListFilterType.ORDER,
    id: 'PERSON_FILTER',
    title: 'title',
    defaultValue: 'defaultOrder',
  }
}
