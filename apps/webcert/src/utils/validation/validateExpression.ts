/* eslint-disable deprecation/deprecation */
import { compileExpression } from '@frontend/filtrex'
import { differenceInHours, fromUnixTime, getUnixTime, isValid, startOfDay, startOfToday } from 'date-fns'
import type { ValueType } from '../../types/certificate'
import { CertificateDataValueType } from '../../types/certificate'
import { getFieldValuePair } from '../certificate/getFieldValuePair'
import { epochDaysAdjustedToTimezone, getValidDate, isValidUncertainDate } from '../dateUtils'

/**
 * Return difference in days
 * ignoring DST and only measure exact 24-hour periods
 */
export const differenceInDays = (a: Date | number, b: Date | number): number => Math.floor(differenceInHours(a, b) / 24)

export const parseDateValue = (date?: string): string | undefined | number => {
  const dateObj = getValidDate(date)
  return dateObj ? getUnixTime(dateObj) : undefined
}

/**
 * @deprecated This function can be removed once date_range 'from'
 * and 'to' is simplified to use days function or unix timestamp.
 */
const parseDateRangeValue = (date?: string): string | undefined | number => {
  const dateObj = getValidDate(date)
  return dateObj ? differenceInDays(dateObj, new Date()) : undefined
}

export const getKeyValuePair = (value: ValueType): Record<string, unknown> => {
  return Object.entries(getFieldValuePair(value)).reduce((result, [field, value]) => {
    switch (value.type) {
      case CertificateDataValueType.BOOLEAN:
        return { ...result, [field]: value.selected }
      case CertificateDataValueType.CODE:
        return { ...result, [field]: value.code }
      case CertificateDataValueType.DATE:
        return { ...result, [field]: parseDateValue(value.date) }
      case CertificateDataValueType.YEAR:
        return { ...result, [field]: value.year }
      case CertificateDataValueType.INTEGER:
        return { ...result, [field]: value.value }
      case CertificateDataValueType.DATE_RANGE:
        return {
          ...result,
          [field]: isValid(getValidDate(value.from)) && isValid(getValidDate(value.to)),
          // TODO: Can be simplified by replacing `ID.from >= 7` with `days(ID.from) <= 7`
          [`${field}.from`]: parseDateRangeValue(value.from),
          [`${field}.to`]: parseDateRangeValue(value.to),
        }
      case CertificateDataValueType.UNCERTAIN_DATE:
        return { ...result, [field]: value.value }
      case CertificateDataValueType.DIAGNOSIS:
        return { ...result, [field]: value.code }
      case CertificateDataValueType.ICF:
      case CertificateDataValueType.TEXT:
        return { ...result, [field]: value.text }
      case CertificateDataValueType.DOUBLE:
        return { ...result, [field]: value.value }
    }
    return result
  }, {})
}

/** convert expression to be compatible with filtrex */
export const convertExpression = (expression: string): string =>
  expression
    .replace(/\|\|/g, 'or')
    .replace(/&&/g, 'and')
    .replace(/!(?!=)/g, 'not ')

/** Compile and execute expression on a certificate value */
export const validateExpression = (expression: string, value: ValueType): boolean =>
  expression === '1' || expression === '0'
    ? expression === '1'
    : Boolean(
        compileExpression(convertExpression(expression), {
          customProp: (id: string, get: (s: string) => unknown, obj: unknown) => (obj == null ? obj : get(id.replace(/\$/g, ''))),
          extraFunctions: {
            epochDay: (val: unknown) => {
              if (typeof val === 'number') {
                return epochDaysAdjustedToTimezone(fromUnixTime(val))
              }
              return NaN
            },
            days: (val: unknown) => {
              if (typeof val === 'number') {
                return differenceInDays(startOfDay(fromUnixTime(val)), startOfToday())
              }
              return NaN
            },
            uncertainDate: (val: unknown) => {
              if (typeof val === 'string') {
                return isValidUncertainDate(val)
              }
              return false
            },
            exists: (val: unknown) => val != null,
            empty: (val: unknown) => val == null || val === '' || (Array.isArray(val) && val.length === 0),
          },
        })(getKeyValuePair(value))
      )
