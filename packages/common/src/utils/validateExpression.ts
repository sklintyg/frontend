import { add, differenceInHours, fromUnixTime, getUnixTime, isValid, startOfDay, startOfToday } from 'date-fns'
import { compileExpression } from 'filtrex'
import { CertificateDataValidationType, CertificateDataValueType, MaxDateValidation, ValueType } from '../types/certificate'
import { getFieldValuePair } from './certificate/getFieldValuePair'
import { epochDaysAdjustedToTimezone, getValidDate, isValidUncertainDate } from './dateUtils'

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
      case CertificateDataValueType.DATE_RANGE:
        return {
          ...result,
          [field]: isValid(getValidDate(value.from)) && isValid(getValidDate(value.to)),
          // TODO: Can be simplified by replacing `ID.from >= 7` with `days(ID.from) <= 7`
          [`${field}.from`]: parseDateRangeValue(value.from),
          [`${field}.to`]: parseDateRangeValue(value.to),
        }
      // TODO: No need to convert uncertain date value if backend expressions are replaced with `uncertainDate(ID)`
      case CertificateDataValueType.UNCERTAIN_DATE:
        return { ...result, [field]: value.value ? isValidUncertainDate(value.value) : false }
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

export const maxDateToExpression = (validation: MaxDateValidation): string =>
  validation.expression ?? `${validation.id} <= ${getUnixTime(add(new Date(), { days: validation.numberOfDays }))}`

/** convert expression to be compatible with filtrex */
export const convertExpression = (expression: string): string =>
  expression
    .replace(/\|\|/g, 'or')
    .replace(/&&/g, 'and')
    .replace(/!(?!=)/g, 'not ')

/** Compile and execute expression on a certificate value */
export const validateExpression = (expression: string, value: ValueType, validationType?: CertificateDataValidationType): boolean =>
  Boolean(
    compileExpression(convertExpression(expression), {
      customProp: (id: string, get: (s: string) => unknown, obj: unknown) => {
        if (obj == null) {
          return obj
        }

        id = id.replace(/\$/g, '')

        // TODO: Should be removed once CODE and CODE_LIST behaves as every other values
        switch (value.type) {
          case CertificateDataValueType.CODE_LIST:
            // Equivalent expression for backend could be something like `CODE in (OPTION_1, OPTION_2)`
            return value.list.find((code) => code.id === id) ? 1 : 0
          case CertificateDataValueType.CODE:
            // Equivalent expression for backend could be something like `ID == OPTION`
            return value.id === id ? 1 : 0
        }

        // TODO: This can be remove if backend expression for
        // mandatory validation is replaced with `exists(ID)` from `!ID`
        if (value.type === CertificateDataValueType.BOOLEAN && validationType === CertificateDataValidationType.MANDATORY_VALIDATION) {
          return get(id) != null ? 1 : 0
        }

        // TODO: This can be removed if backend expression for
        // epochDay is replaced with `epochDay(ID)` from `ID.toEpochDay`
        if (id.includes('toEpochDay')) {
          const val = get(id.replace('.toEpochDay', ''))
          if (typeof val === 'number') {
            return epochDaysAdjustedToTimezone(fromUnixTime(val))
          }
        }

        return get(id)
      },
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
