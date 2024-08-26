import type { ValueType } from '../../types/certificate'

const getFieldValuePairFromList = (list: ValueType[]): Record<string, ValueType> =>
  list.reduce((result, value: ValueType) => Object.assign(result, getFieldValuePair(value)), {})

const getValuePair = (
  value: {
    id?: unknown
  } & ValueType
): Record<string, ValueType> => (typeof value.id === 'string' ? { [value.id]: value } : {})

const getValueListPair = (
  value: {
    list?: ValueType[]
  } & ValueType
): Record<string, ValueType> => (value.list instanceof Array ? getFieldValuePairFromList(value.list) : {})

const getValueObjectPair = (
  value: {
    list?: ValueType[]
  } & ValueType
): Record<string, ValueType> =>
  typeof value === 'object'
    ? Object.values(value).reduce<Record<string, ValueType>>(
        (result, item) => (item != null ? { ...result, ...getFieldValuePair(item) } : result),
        {}
      )
    : {}

export const getFieldValuePair = (value: ValueType): Record<string, ValueType> => ({
  ...getValuePair(value),
  ...getValueListPair(value),
  ...getValueObjectPair(value),
})
