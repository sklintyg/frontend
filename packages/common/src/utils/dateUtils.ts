import { ValueDateRange, ValueDateRangeList } from './../types/certificate'
import { parse, format } from 'date-fns'
import { ConfigUeCheckboxDateRange } from '..'

const _dateReg = /[1-2][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
const _dateRegDashesOptional = /[1-2][0-9]{3}-?(0[1-9]|1[0-2])-?(0[1-9]|[1-2][0-9]|3[0-1])/
const _format = 'yyyy-MM-dd'
const _parseformat = 'yyyyMMdd'

const dayCodeReg = /^(?=\d*d\d*$)d?(?!0+d?$)(\d{1,3})d?$/i
const weekCodeReg = /^(?=\d*v\d*$)v?(?!0+v?$)(\d{1,3})v?$/i
const monthCodeReg = /^(?=\d*m\d*$)m?(?!0+m?$)(\d{1,2})m?$/i

export const getValidDate = (dateString: string) => {
  if (_dateReg.test(dateString)) {
    const formattedString = dateString.replace(/-/g, '')
    return parse(formattedString, _parseformat, new Date())
  } else if (_dateRegDashesOptional.test(dateString)) {
    return parse(dateString, _parseformat, new Date())
  }
}

export const formatDateToString = (date: Date) => {
  return format(date, _format)
}

export const parseDayCodes = (input: string) => {
  if (input && typeof input === 'string') {
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

export const parseMonthCode = (input: string) => {
  if (input && typeof input === 'string') {
    const result = monthCodeReg.exec(input)
    if (result && result.length > 0) {
      return parseInt(result[1], 10)
    }
  }
  return null
}

export const getLatestPeriodEndDate = (configList: ConfigUeCheckboxDateRange[], valueList: ValueDateRange[], periodId: string) => {
  const indexOfCurrentQuestion = configList.findIndex((cfg) => cfg.id.toLowerCase() === periodId.toLowerCase())

  if (indexOfCurrentQuestion == 0) return null

  let maxDate: Date | undefined

  for (let i = 0; i < indexOfCurrentQuestion; i++) {
    const currPeriodId = configList[i].id
    const currPeriodValue = valueList.find((val) => val.id.toLowerCase() === currPeriodId.toLowerCase())

    if (currPeriodValue?.to) {
      maxDate = getValidDate(currPeriodValue.to)
    }
  }

  return maxDate
}
