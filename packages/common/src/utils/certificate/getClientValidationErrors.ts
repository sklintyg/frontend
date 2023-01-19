import { isBefore, isValid, toDate } from 'date-fns'
import {
  CertificateDataElement,
  CertificateDataValueType,
  getPeriodHasOverlap,
  getValidDate,
  getValidDateFormat,
  isValidDateIncludingSpecialDateCodes,
  ValidationError,
  Value,
  ValueType,
} from '../..'
import { CertificateDataConfigType, ConfigTypes } from '../../types/certificate'
import { getFieldValuePair } from './getFieldValuePair'

const INVALID_DATE_FORMAT_ERROR = {
  type: 'INVALID_DATE_FORMAT',
  text: 'Ange datum i formatet åååå-mm-dd.',
  showAlways: true,
}

const UNREASONABLE_DATE = {
  type: 'UNREASONABLE_DATE',
  text: 'Ange ett datum som inte ligger för långt fram eller tillbaka i tiden.',
  showAlways: true,
}

const EMPTY_DATE = {
  type: 'EMPTY_DATE',
  text: 'Ange datum.',
  showAlways: false,
}

const INVALID_DATE_PERIOD_ERROR = {
  type: 'INVALID_DATE_PERIOD',
  text: 'Ange ett slutdatum som infaller efter startdatumet.',
  showAlways: true,
}

const NOT_COMPLETE_DATE_ERROR_MESSAGE = {
  type: 'NOT_COMPLETE_DATE',
  text: 'Ange ett datum.',
  showAlways: false,
}

const OVERLAP_ERROR = {
  text: 'Ange sjukskrivningsperioder som inte överlappar varandra.',
  type: 'OVERLAP_ERROR',
  showAlways: true,
}

function isDateFormatValid(toDate?: string, fromDate?: string) {
  return (toDate && isValidDateIncludingSpecialDateCodes(toDate)) || (fromDate && isValid(getValidDate(fromDate)))
}

const getValidationErrorFactory = (id: string, field = '') => ({
  text,
  type,
  showAlways,
}: Pick<ValidationError, 'text' | 'type' | 'showAlways'>): ValidationError => {
  return { category: '', field, id, text, type, showAlways }
}

const isValueFormatIncorrect = (value?: string): boolean => {
  return Boolean(value && value.length > 0 && !isValid(getValidDateFormat(value)))
}

const isValueUnreasonable = (value?: string): boolean => {
  return Boolean(value && value.length > 0 && !isValid(getValidDate(value)))
}

const getDateValidationError = (id: string, field: string, date?: string): ValidationError | undefined => {
  const validationErrorFactory = getValidationErrorFactory(id, field)
  if (isValueFormatIncorrect(date)) {
    return validationErrorFactory(INVALID_DATE_FORMAT_ERROR)
  } else if (isValueUnreasonable(date)) {
    return validationErrorFactory(UNREASONABLE_DATE)
  } else if (date == null || date.length === 0) {
    return validationErrorFactory(EMPTY_DATE)
  }
}

const getErrorsFromValue = (id: string, value: Value | null): ValidationError[] => {
  if (value == null) {
    return []
  }
  return Object.entries(getFieldValuePair(value as ValueType)).reduce<ValidationError[]>((result, [field, value]) => {
    switch (value.type) {
      case CertificateDataValueType.DATE: {
        return result.concat(getDateValidationError(id, field, value.date) ?? [])
      }
      case CertificateDataValueType.DATE_RANGE: {
        const validationErrorFactory = getValidationErrorFactory(id, `row.${field}`)
        const validFromDate = getValidDate(value.from ?? '')
        const validToDate = getValidDate(value.to ?? '')
        const invalidDatePeriod = !!validFromDate && !!validToDate && isBefore(validToDate, validFromDate)
        const notCompleteDatePeriod = ((value.from && !toDate) || (toDate && !value.from)) && isDateFormatValid(value.to, value.from)
        return result
          .concat(getDateValidationError(id, `from.${field}`, value.from) ?? [])
          .concat(getDateValidationError(id, `tom.${field}`, value.to) ?? [])
          .concat(invalidDatePeriod ? validationErrorFactory(INVALID_DATE_PERIOD_ERROR) : [])
          .concat(notCompleteDatePeriod ? validationErrorFactory(NOT_COMPLETE_DATE_ERROR_MESSAGE) : [])
      }
      default:
        return result
    }
  }, [])
}

const getErrorsFromConfig = (id: string, config: CertificateDataConfigType, value: ValueType | null): ValidationError[] => {
  const validationErrorFactory = getValidationErrorFactory(id, id)

  if (value == null) {
    return []
  }

  switch (config.type) {
    case ConfigTypes.UE_SICK_LEAVE_PERIOD:
      if (value.type === CertificateDataValueType.DATE_RANGE_LIST) {
        const hasAnyOverlap = value.list.some((val) => getPeriodHasOverlap(value.list, val.id))
        if (hasAnyOverlap) {
          return [validationErrorFactory(OVERLAP_ERROR)]
        }
      }
  }
  return []
}

export const getClientValidationErrors = ({ id, value, config }: CertificateDataElement): ValidationError[] => {
  return [...getErrorsFromValue(id, value), ...getErrorsFromConfig(id, config as CertificateDataConfigType, value as ValueType)]
}
