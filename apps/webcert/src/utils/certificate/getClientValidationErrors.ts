import { isAfter, isBefore, isValid } from 'date-fns'
import {
  CertificateDataConfigType,
  CertificateDataElement,
  CertificateDataValueType,
  ConfigTypes,
  ValidationError,
  ValueType,
} from '../../types'
import { getPeriodHasOverlap, getValidDate, getValidDateFormat } from '../dateUtils'
import { getFieldValuePair } from './getFieldValuePair'

const INVALID_DATE_FORMAT = {
  type: 'INVALID_DATE_FORMAT',
  text: 'Ange giltigt datum i formatet åååå-mm-dd.',
  showAlways: true,
}

const UNREASONABLE_DATE = {
  type: 'UNREASONABLE_DATE',
  text: 'Ange ett datum som inte ligger för långt fram eller tillbaka i tiden.',
  showAlways: true,
}

const INVALID_YEAR_FORMAT = {
  type: 'INVALID_YEAR_FORMAT',
  text: 'Ange år i formatet åååå.',
  showAlways: true,
}

const UNREASONABLE_YEAR = {
  type: 'UNREASONABLE_YEAR',
  text: 'Ange ett år som inte ligger för långt fram eller tillbaka i tiden.',
  showAlways: true,
}

const EMPTY_PERIOD = {
  type: 'EMPTY_PERIOD',
  text: 'Ange period.',
  showAlways: false,
}

const INVALID_DATE_PERIOD_ERROR = {
  type: 'INVALID_DATE_PERIOD',
  text: 'Ange ett slutdatum som infaller efter startdatumet.',
  showAlways: true,
}

const OVERLAP_ERROR = {
  text: 'Ange perioder som inte överlappar varandra.',
  type: 'OVERLAP_ERROR',
  showAlways: true,
}

const getValidationErrorFactory =
  (id: string, field = '') =>
  ({ text, type, showAlways }: Pick<ValidationError, 'text' | 'type' | 'showAlways'>): ValidationError => {
    return { category: '', field, id, text, type, showAlways }
  }

const getEarlyDateError = (id: string, field: string, min?: string) => {
  return getValidationErrorFactory(
    id,
    field
  )({ type: 'DATE_VIOLATES_LIMIT', text: `Ange ett datum som är tidigast ${min ?? ''}.`, showAlways: true })
}

const getLateDateError = (id: string, field: string, max?: string) => {
  return getValidationErrorFactory(
    id,
    field
  )({ type: 'DATE_VIOLATES_LIMIT', text: `Ange ett datum som är senast ${max ?? ''}.`, showAlways: true })
}

const isValueFormatIncorrect = (value?: string): boolean => {
  return Boolean(value && value.length > 0 && !isValid(getValidDateFormat(value)))
}

const isValueUnreasonable = (value?: string): boolean => {
  return Boolean(value && value.length > 0 && !isValid(getValidDate(value)))
}

const isDateEmpty = (date?: string): boolean => {
  return Boolean(date == null || date.length === 0)
}

const isDateBeforeLimit = (min?: string, date?: string): boolean => {
  const dateFormat = getValidDateFormat(date)
  return !!dateFormat && !!min && date != min && isBefore(dateFormat, new Date(min))
}

const isDateAfterLimit = (max?: string, date?: string): boolean => {
  const dateFormat = getValidDateFormat(date)
  return !!dateFormat && !!max && date != max && isAfter(dateFormat, new Date(max))
}

export const getDateValidationError = (id: string, field: string, date?: string): ValidationError | undefined => {
  const validationErrorFactory = getValidationErrorFactory(id, field)
  if (isValueFormatIncorrect(date)) {
    return validationErrorFactory(INVALID_DATE_FORMAT)
  } else if (isValueUnreasonable(date)) {
    return validationErrorFactory(UNREASONABLE_DATE)
  }
}

const getErrorsFromValue = (id: string, value: ValueType | null): ValidationError[] => {
  if (value == null) {
    return []
  }
  return Object.entries(getFieldValuePair(value)).reduce<ValidationError[]>((result, [field, value]) => {
    switch (value.type) {
      case CertificateDataValueType.DATE: {
        return result.concat(getDateValidationError(id, field, value.date) ?? [])
      }
      case CertificateDataValueType.YEAR: {
        const year = value.year ? `${value.year}-01-01` : undefined
        if (isValueFormatIncorrect(year)) {
          return result.concat(getValidationErrorFactory(id, field)(INVALID_YEAR_FORMAT))
        } else if (isValueUnreasonable(year)) {
          return result.concat(getValidationErrorFactory(id, field)(UNREASONABLE_YEAR))
        }
        return result
      }
      case CertificateDataValueType.DATE_RANGE: {
        const validFromDate = getValidDate(value.from ?? '')
        const validToDate = getValidDate(value.to ?? '')
        const isBothEmpty = isDateEmpty(value.from) && isDateEmpty(value.to)
        const invalidDatePeriod = !!validFromDate && !!validToDate && isBefore(validToDate, validFromDate)

        return result
          .concat(getDateValidationError(id, `from.${field}`, value.from) ?? [])
          .concat(getDateValidationError(id, `tom.${field}`, value.to) ?? [])
          .concat(isBothEmpty ? getValidationErrorFactory(id, `row.${field}`)(EMPTY_PERIOD) : [])
          .concat(invalidDatePeriod ? getValidationErrorFactory(id, `row.${field}`)(INVALID_DATE_PERIOD_ERROR) : [])
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
    case ConfigTypes.UE_DATE:
      if (value.type === CertificateDataValueType.DATE) {
        if (isDateBeforeLimit(config.minDate, value.date)) {
          return [getEarlyDateError(id, id, config.minDate)]
        }

        if (isDateAfterLimit(config.maxDate, value.date)) {
          return [getLateDateError(id, id, config.maxDate)]
        }

        return []
      }
      break
    case ConfigTypes.UE_CHECKBOX_DATE_RANGE_LIST:
      if (value.type === CertificateDataValueType.DATE_RANGE_LIST) {
        const hasAnyOverlap = value.list.some((val) => getPeriodHasOverlap(value.list, val.id))
        const overlapErrors = hasAnyOverlap ? [validationErrorFactory(OVERLAP_ERROR)] : []

        const fromViolationAgainstMinLimit = value.list
          .filter((val) => isDateBeforeLimit(config.min, val.from))
          .map((val) => getEarlyDateError(id, `${val.id}.from`, config.min))

        const toViolationAgainstMinLimit = value.list
          .filter((val) => isDateBeforeLimit(config.min, val.to))
          .map((val) => getEarlyDateError(id, `${val.id}.to`, config.min))

        const fromViolationAgainstMaxLimit = value.list
          .filter((val) => isDateAfterLimit(config.max, val.from))
          .map((val) => getLateDateError(id, `${val.id}.from`, config.max))

        const toViolationAgainstMaxLimit = value.list
          .filter((val) => isDateAfterLimit(config.max, val.to))
          .map((val) => getLateDateError(id, `${val.id}.to`, config.max))

        return overlapErrors
          .concat(fromViolationAgainstMinLimit)
          .concat(toViolationAgainstMinLimit)
          .concat(fromViolationAgainstMaxLimit)
          .concat(toViolationAgainstMaxLimit)
      }
  }
  return []
}

export const getClientValidationErrors = ({ id, value, config }: CertificateDataElement): ValidationError[] => {
  return [...getErrorsFromValue(id, value), ...getErrorsFromConfig(id, config as CertificateDataConfigType, value)]
}
