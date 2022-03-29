import {
  ListFilterBooleanConfig,
  ListFilterConfig,
  ListFilterOrderConfig,
  ListFilterPageSizeConfig,
  ListFilterSelectConfig,
  ListFilterType,
  ListFilterValueBoolean,
  ListFilterValueDateRange,
  ListFilterValueNumber,
  ListFilterValuePersonId,
  ListFilterValueSelect,
  ListFilterValueText,
} from '@frontend/common/src/types/list'

export const getListFilterDefaultValue = (filter: ListFilterConfig) => {
  let defaultValue = { type: ListFilterType.UNKOWN }
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
