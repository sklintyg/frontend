import { ValueType, CertificateDataValueType, MaxDateValidation, CertificateDataValidationType } from '../types/certificate'
import { isValid, getUnixTime, add, differenceInDays } from 'date-fns'
import { getValidDate, epochDaysAdjustedToTimezone, isValidUncertainDate } from './dateUtils'
import { compileExpression } from 'filtrex'

const getKeyValuePairFromList = (list: ValueType[]) =>
  list.reduce((result: Record<string, unknown>, value: ValueType) => Object.assign(result, getKeyValuePair(value)), {})

const parseDateValue = (date?: string, manipulate?: (date: Date | number) => number): string | undefined | number => {
  const dateObj = getValidDate(date)
  if (manipulate == null) {
    manipulate = getUnixTime
  }
  return dateObj ? manipulate(dateObj) : date
}

export const getKeyValuePair = (value: ValueType): Record<string, unknown> => {
  switch (value.type) {
    case CertificateDataValueType.BOOLEAN:
      return { [value.id]: value.selected }
    case CertificateDataValueType.CAUSE_OF_DEATH:
      return {
        ...getKeyValuePair(value.debut),
        ...getKeyValuePair(value.description),
        ...getKeyValuePair(value.specification),
      }
    case CertificateDataValueType.CODE:
      return { [value.id]: value.code }
    case CertificateDataValueType.DATE:
      return { [value.id]: parseDateValue(value.date) }
    case CertificateDataValueType.DATE_RANGE:
      return {
        [value.id]: isValid(getValidDate(value.from)) && isValid(getValidDate(value.to)),
        // TODO: Can be simplified by replacing `ID.from >= 7` with `days(ID.from) <= 7`
        [`${value.id}.from`]: parseDateValue(value.from, (date) => differenceInDays(date, new Date())),
        [`${value.id}.to`]: parseDateValue(value.to, (date) => differenceInDays(date, new Date())),
      }
    // TODO: No need to convert uncertain date value if backend expressions are replaced with `uncertainDate(ID)`
    case CertificateDataValueType.UNCERTAIN_DATE:
      return { [value.id]: value.value ? isValidUncertainDate(value.value) : false }
    case CertificateDataValueType.DIAGNOSIS:
      return { [value.id]: value.code }
    case CertificateDataValueType.ICF:
    case CertificateDataValueType.TEXT:
      return { [value.id]: value.text }
    default:
      return value.list instanceof Array ? getKeyValuePairFromList(value.list) : {}
  }
}

export const maxDateToExpression = (validation: MaxDateValidation): string =>
  validation.expression ?? `${validation.id} <= ${getUnixTime(add(new Date(), { days: validation.numberOfDays }))}`

/** convert expression to be compatible with filtrex */
export const convertExpression = (expression: string): string =>
  expression
    .replace(/\|\|/g, 'or')
    .replace(/&&/g, 'and')
    .replace(/!(?!=)/g, 'not ')
    .replace(/\$/g, '')

/** Compile and execute expression on a certificate value */
export const validateExpression = (expression: string, value: ValueType, validationType?: CertificateDataValidationType): boolean =>
  Boolean(
    compileExpression(convertExpression(expression), {
      customProp: (id: string, get: (s: string) => unknown, obj: unknown) => {
        if (obj == null) {
          return obj
        }

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
        // mandatory validation is replaced with `!empty(ID)` from `!ID`
        if (value.type === CertificateDataValueType.BOOLEAN && validationType === CertificateDataValidationType.MANDATORY_VALIDATION) {
          return get(id) != null ? 1 : 0
        }

        // TODO: This can be removed if backend expression for
        // epochDay is replaced with `epochDay(ID)` from `ID.toEpochDay`
        if (id.includes('toEpochDay')) {
          const val = get(id.replace('.toEpochDay', ''))
          if (typeof val === 'number') {
            return epochDaysAdjustedToTimezone(new Date(val * 1000))
          }
        }

        return get(id)
      },
      extraFunctions: {
        epochDay: (val: unknown) => {
          if (typeof val === 'number') {
            return epochDaysAdjustedToTimezone(new Date(val * 1000))
          }
          return NaN
        },
        days: (val: unknown) => {
          if (typeof val === 'number') {
            return differenceInDays(new Date(val * 1000), new Date())
          }
          return NaN
        },
        uncertainDate: (val: unknown) => {
          if (typeof val === 'string') {
            return isValidUncertainDate(val)
          }
          return false
        },
      },
    })(getKeyValuePair(value))
  )
