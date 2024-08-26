import { isEqual } from 'lodash-es'
import type {
  CertificateListItemValueType,
  ListConfig,
  ListFilterBooleanConfig,
  ListFilterConfig,
  ListFilterDateRangeConfig,
  ListFilterOrderConfig,
  ListFilterPageSizeConfig,
  ListFilterRadioConfig,
  ListFilterSelectConfig,
  ListFilterValue,
  ListFilterValueDateRange} from '../../types';
import {
  ListFilterType
} from '../../types'

export const getListFilterDefaultValue = (filter: ListFilterConfig): ListFilterValue => {
  switch (filter.type) {
    case ListFilterType.TEXT:
      return { type: filter.type, value: '' }
    case ListFilterType.PERSON_ID:
      return { type: filter.type, value: '' }
    case ListFilterType.SELECT: {
      const defaultSelectValue = (filter as ListFilterSelectConfig).values.find((v) => v.defaultValue)
      return {
        type: filter.type,
        value: defaultSelectValue ? defaultSelectValue.id : '',
      }
    }
    case ListFilterType.RADIO: {
      const defaultValue = (filter as ListFilterRadioConfig).values.find((v) => v.defaultValue)
      return {
        type: filter.type,
        value: defaultValue ? defaultValue.id : '',
      }
    }
    case ListFilterType.DATE_RANGE: {
      const dateRangeFilter = filter as ListFilterDateRangeConfig
      return {
        type: dateRangeFilter.type,
        to: dateRangeFilter.to.defaultValue ? dateRangeFilter.to.defaultValue.split('T')[0] : '',
        from: dateRangeFilter.from.defaultValue ? dateRangeFilter.from.defaultValue.split('T')[0] : '',
      } as ListFilterValueDateRange
    }
    case ListFilterType.ORDER:
      return {
        type: filter.type,
        value: (filter as ListFilterOrderConfig).defaultValue,
      }
    case ListFilterType.BOOLEAN:
      return {
        type: filter.type,
        value: (filter as ListFilterBooleanConfig).defaultValue,
      }
    case ListFilterType.PAGESIZE:
      return {
        type: ListFilterType.NUMBER,
        value: (filter as ListFilterPageSizeConfig).pageSizes[0],
      }
    default:
      return { type: ListFilterType.UNKOWN }
  }
}

export const isFilterDefault = (configs: ListFilterConfig[] | undefined, values?: Record<string, ListFilterValue>): boolean => {
  let isDefault = true
  if (!configs || !values) {
    return false
  }
  Object.keys(values).forEach((key) => {
    const matchedConfig = configs.find((config) => config.id === key)
    const defaultValue = matchedConfig ? getListFilterDefaultValue(matchedConfig) : null
    if (!isEqual(values[key], defaultValue)) {
      isDefault = false
    }
  })
  return isDefault
}

export const isFilterValueDefault = (config: ListFilterConfig, value: ListFilterValue): boolean => {
  return isEqual(value, getListFilterDefaultValue(config))
}

export const getTooltip = (config: ListConfig, id: CertificateListItemValueType): string => {
  return config?.buttonTooltips[id] ?? ''
}
