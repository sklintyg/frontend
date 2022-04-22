import {
  ListFilterBooleanConfig,
  ListFilterConfig,
  ListFilterOrderConfig,
  ListFilterPageSizeConfig,
  ListFilterSelectConfig,
  ListFilterType,
  ListFilterValue,
  ListFilterValueBoolean,
  ListFilterValueDateRange,
  ListFilterValueNumber,
  ListFilterValuePersonId,
  ListFilterValues,
  ListFilterValueSelect,
  ListFilterValueText,
} from '@frontend/common/src/types/list'
import { isPersonIdValid } from '@frontend/common/src/utils/personIdValidatorUtils'

export const getListFilterDefaultValue = (filter: ListFilterConfig): ListFilterValue => {
  switch (filter.type) {
    case ListFilterType.TEXT:
      return { type: filter.type, value: '' } as ListFilterValueText
    case ListFilterType.PERSON_ID:
      return { type: filter.type, value: '' } as ListFilterValuePersonId
    case ListFilterType.SELECT:
      const defaultSelectValue = (filter as ListFilterSelectConfig).values.find((v) => v.defaultValue)
      return {
        type: filter.type,
        value: defaultSelectValue ? defaultSelectValue.id : '',
      } as ListFilterValueSelect
    case ListFilterType.DATE_RANGE:
      const dateRangeFilter = filter as ListFilterDateRangeConfig
      return {
        type: dateRangeFilter.type,
        to: dateRangeFilter.to.defaultValue ? dateRangeFilter.to.defaultValue.split('T')[0] : '',
        from: dateRangeFilter.from.defaultValue ? dateRangeFilter.from.defaultValue.split('T')[0] : '',
      } as ListFilterValueDateRange
    case ListFilterType.ORDER:
      return {
        type: filter.type,
        value: (filter as ListFilterOrderConfig).defaultValue,
      } as ListFilterValueText
    case ListFilterType.BOOLEAN:
      return {
        type: filter.type,
        value: (filter as ListFilterBooleanConfig).defaultValue,
      } as ListFilterValueBoolean
    case ListFilterType.PAGESIZE:
      return {
        type: ListFilterType.NUMBER,
        value: (filter as ListFilterPageSizeConfig).pageSizes[0],
      } as ListFilterValueNumber
    default:
      return { type: ListFilterType.UNKOWN }
  }

  return defaultValue
}

export const isFilterValuesValid = (listFilterValues: ListFilterValues | undefined): boolean => {
  let hasValidationErrors = false
  if (!listFilterValues) {
    return true
  }
  Object.keys(listFilterValues).forEach((key) => {
    if (listFilterValues[key].type === ListFilterType.PERSON_ID) {
      const personId = (listFilterValues[key] as ListFilterValuePersonId).value
      hasValidationErrors = personId !== '' && !isPersonIdValid(personId)
    }
  })
  return !hasValidationErrors
}
