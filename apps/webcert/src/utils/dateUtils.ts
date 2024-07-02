import { areIntervalsOverlapping, differenceInCalendarDays, format, isAfter, isBefore, isSameDay, isValid, parse } from 'date-fns'
import { ConfigUeCheckboxDateRange } from '../types/certificateDataConfig'
import { ValueDateRange } from '../types/certificateDataValue'
import { replaceDecimalSeparator } from './textUtils'

export const _dateReg = /[1-9][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
export const _dateRegDashesOptional = /[1-9][0-9]{3}-?(0[1-9]|1[0-2])-?(0[1-9]|[1-2][0-9]|3[0-1])/

export const _minAllowedDate = new Date(1900, 0, 2)
export const _maxAllowedDate = new Date(2099, 11, 12)

export const _format = 'yyyy-MM-dd'
export const _parseformat = 'yyyyMMdd'

export const _yearFormat = 'yyyy'

export const dayCodeReg = /^(?=\d*d\d*$)d?(?!0+d?$)(\d{1,3})d?$/i
export const weekCodeReg = /^(?=\d*v\d*$)v?(?!0+v?$)(\d{1,3})v?$/i
export const monthCodeReg = /^(?=\d*m\d*$)m?(?!0+m?$)(\d{1,2})m?$/i

export enum SickLeavePeriods {
  EN_FJARDEDEL = 'EN_FJARDEDEL',
  HALFTEN = 'HALFTEN',
  TRE_FJARDEDEL = 'TRE_FJARDEDEL',
  HELT_NEDSATT = 'HELT_NEDSATT',
}

export const getValidDateFormat = (dateString: string | undefined): Date | undefined => {
  if (!dateString) return

  if (_dateReg.test(dateString)) {
    const formattedString = dateString.replace(/-/g, '')
    return parse(formattedString, _parseformat, new Date())
  } else if (_dateRegDashesOptional.test(dateString)) {
    return parse(dateString, _parseformat, new Date())
  }
}

export const epochDaysAdjustedToTimezone = (date: Date): number => Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 8.64e7)

export const getValidDate = (dateString: string | undefined): Date | undefined => {
  if (!dateString) return

  const dateValue = getValidDateFormat(dateString)
  if (dateValue) {
    if (!isBefore(dateValue, _minAllowedDate) && !isAfter(dateValue, _maxAllowedDate)) return dateValue
  }
}

export const isValidUncertainDate = (dateString: string): boolean => /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(dateString)

export const isValidDateIncludingSpecialDateCodes = (dateString: string | undefined) => {
  if (!dateString) return

  return isValid(getValidDate(dateString)) || dayCodeReg.test(dateString) || weekCodeReg.test(dateString) || monthCodeReg.test(dateString)
}

export const formatDateToString = (date: Date): string => {
  return format(date, _format)
}

export const parseDayCodes = (input: string): number | null => {
  if (input) {
    let result = dayCodeReg.exec(input)
    if (result && result.length > 0) {
      return parseInt(result[1], 10)
    }
    result = weekCodeReg.exec(input)
    if (result && result.length > 0) {
      return parseInt(result[1], 10) * 7
    }
    const months = parseMonthCode(input)
    if (months) {
      return months * 31
    }
  }
  return null
}

export const parseMonthCode = (input: string): number | null => {
  if (input) {
    const result = monthCodeReg.exec(input)
    if (result && result.length > 0) {
      return parseInt(result[1], 10)
    }
  }
  return null
}

export const getLatestPeriodEndDate = (configList: ConfigUeCheckboxDateRange[], valueList: ValueDateRange[]): Date | undefined => {
  let maxDate: Date | undefined

  for (let i = 0; i < configList.length; i++) {
    const currPeriodId = configList[i].id
    const currPeriodValue = valueList.find((val) => val.id.toLowerCase() === currPeriodId.toLowerCase())

    if (currPeriodValue?.to && getValidDate(currPeriodValue.to)) {
      const currentDate = getValidDate(currPeriodValue.to)

      if (!maxDate) {
        maxDate = currentDate
        continue
      }

      if (isAfter(currentDate!, maxDate)) {
        maxDate = currentDate
      }
    }
  }

  return maxDate
}

export const getPeriodHasOverlap = (valueList: ValueDateRange[], currentPeriodId: string): boolean => {
  const currentPeriod = valueList.find((val) => val.id === currentPeriodId)
  if (!currentPeriod || !currentPeriod.from || !currentPeriod.to) return false

  const { from, to } = currentPeriod
  const currentFromDate = getValidDate(from)
  const currentToDate = getValidDate(to)

  if (!currentFromDate || !currentToDate) return false

  let overlapFound = false

  valueList.forEach((period) => {
    if (period.id === currentPeriodId) return

    const fromDate = getValidDate(period.from)
    const toDate = getValidDate(period.to)

    if (!fromDate || !toDate) return

    if (isSameDay(fromDate, currentFromDate) || isSameDay(toDate, currentToDate)) {
      overlapFound = true
    } else if (
      getIsIntervalsCorrect(fromDate, toDate, currentFromDate, currentToDate) &&
      areIntervalsOverlapping({ start: fromDate, end: toDate }, { start: currentFromDate, end: currentToDate }, { inclusive: true })
    ) {
      overlapFound = true
    }
  })

  return overlapFound
}

const getIsIntervalsCorrect = (leftStartTime: Date, leftEndTime: Date, rightStartTime: Date, rightEndTime: Date) => {
  return leftStartTime <= leftEndTime && rightStartTime <= rightEndTime
}

const calculatePeriodWorkHours = (hoursWorkingPerWeek: number, percentage: number) => {
  const periodWorkHoursToString = (hoursWorkingPerWeek * percentage).toString()
  return replaceDecimalSeparator(periodWorkHoursToString)
}

export const getPeriodWorkHours = (hoursWorkingPerWeek: number, sickLeavePercentage: string): string | 0 => {
  if (sickLeavePercentage === SickLeavePeriods.EN_FJARDEDEL) {
    return calculatePeriodWorkHours(hoursWorkingPerWeek, 0.75)
  } else if (sickLeavePercentage === SickLeavePeriods.HALFTEN) {
    return calculatePeriodWorkHours(hoursWorkingPerWeek, 0.5)
  } else if (sickLeavePercentage === SickLeavePeriods.TRE_FJARDEDEL) {
    return calculatePeriodWorkHours(hoursWorkingPerWeek, 0.25)
  } else if (sickLeavePercentage === SickLeavePeriods.HELT_NEDSATT) {
    return 0
  }

  return 0
}

export const getPeriodWorkDays = (fromDate: Date, toDate: Date): number => {
  return differenceInCalendarDays(toDate, fromDate) + 1
}

export const getNumberOfPeriodDays = (periods: ValueDateRange[]): number => {
  let total = 0

  for (let i = 0; i < periods.length; i++) {
    if (getValidDate(periods[i].from) && getValidDate(periods[i].to)) {
      total += getPeriodWorkDays(getValidDate(periods[i].from)!, getValidDate(periods[i].to)!)
    }
  }

  return total
}

export const filterDateRangeValueList = (valueList: ValueDateRange[]): ValueDateRange[] => {
  return valueList
    .map((val) => ({
      ...val,
      from: getValidDate(val?.from) ? val?.from : undefined,
      to: getValidDate(val?.to) ? val?.to : undefined,
    }))
    .filter((val) => val.to !== undefined || val.from !== undefined)
}

export const isDateRangeValid = (fromDateInput: string, toDateInput: string): boolean => {
  return (
    isValid(getValidDate(fromDateInput)) &&
    isValid(getValidDate(toDateInput)) &&
    !isBefore(getValidDate(toDateInput)!, getValidDate(fromDateInput)!)
  )
}

export const isDateRangeValidOrIncomplete = (fromDateInput: string, toDateInput: string): boolean => {
  const areBothDatesValid = isValid(getValidDate(fromDateInput)) && isValid(getValidDate(toDateInput))
  return !areBothDatesValid || !isBefore(getValidDate(toDateInput)!, getValidDate(fromDateInput)!)
}

export const isFutureDate = (date: string): boolean => {
  if (!getValidDate(date)) {
    return false
  }
  return getValidDate(date)! > new Date()
}

export const isDateBehindLimit = (date: string, limit: string): boolean => {
  return isValid(getValidDate(date)) && date < limit
}

export const formatDate = (value: string): string => {
  if (value) {
    const splitDate = value.toString().split('T')
    if (splitDate.length > 1) {
      return `${splitDate[0]} ${splitDate[1].substring(0, 5)}`
    }
    return value
  } else {
    return ''
  }
}
