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
  let defaultValue: ListFilterValue = { type: ListFilterType.UNKOWN }
  if (filter.type === ListFilterType.TEXT) {
    defaultValue = { type: filter.type, value: '' } as ListFilterValueText
  } else if (filter.type === ListFilterType.PERSON_ID) {
    defaultValue = { type: filter.type, value: '' } as ListFilterValuePersonId
  } else if (filter.type === ListFilterType.SELECT) {
    const defaultSelectValue = (filter as ListFilterSelectConfig).values.find((v) => v.defaultValue)
    defaultValue = { type: filter.type, value: defaultSelectValue ? defaultSelectValue.id : '' } as ListFilterValueSelect
  } else if (filter.type === ListFilterType.DATE_RANGE) {
    defaultValue = { type: filter.type, to: '', from: '' } as ListFilterValueDateRange
  } else if (filter.type === ListFilterType.ORDER) {
    defaultValue = { type: filter.type, value: (filter as ListFilterOrderConfig).defaultValue } as ListFilterValueText
  } else if (filter.type === ListFilterType.BOOLEAN) {
    defaultValue = { type: filter.type, value: (filter as ListFilterBooleanConfig).defaultValue } as ListFilterValueBoolean
  } else if (filter.type === ListFilterType.PAGESIZE) {
    defaultValue = {
      type: ListFilterType.NUMBER,
      value: (filter as ListFilterPageSizeConfig).pageSizes[0],
    } as ListFilterValueNumber
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
