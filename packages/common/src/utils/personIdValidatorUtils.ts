import { intervalToDuration, isFuture, isValid, parseISO } from 'date-fns'

const MAXIMUM_AGE = 125

export const isPersonIdValid = (id: string): boolean => isPersonIdNumberValid(id) || isCoordinationNumberValid(id)

export const formatPersonId = (id: string): string => {
  let cleanId = id.replace(/\D/g, '')
  if (cleanId.length > 8) {
    cleanId = cleanId.slice(0, 8) + '-' + cleanId.slice(8, cleanId.length)
  }
  return cleanId
}

const isPersonIdNumberValid = (value: string): boolean => {
  const PERSON_ID_NUMBER_REGEXP = /^(\d{2})(\d{2})(\d{2})([0-3]\d)([-+]?)(\d{4})$/
  const parts = PERSON_ID_NUMBER_REGEXP.exec(value)

  if (!parts) return false

  const [fullMatch, century, year, month, day, separator, birthDigits] = parts
  const parsedDate = parseISO(century + year + '-' + month + '-' + day)

  if (!isValid(parsedDate) || isFuture(parsedDate) || exceedsMaximumAge(parsedDate)) {
    return false
  }

  return isCheckDigitValid(year + month + day + birthDigits)
}

const isCoordinationNumberValid = (value: string): boolean => {
  const COORDINATION_NUMBER_REGEXP = /^(\d{2})(\d{2})(\d{2})([6-9]\d)-?(\d{4})$/
  const parts = COORDINATION_NUMBER_REGEXP.exec(value)

  if (!parts) return false

  const [fullMatch, century, year, month, incrementedDay, birthDigits] = parts
  const day = toNumber(incrementedDay) - 60 // 60 is a special number for co-ordination number
  const parsedDate = parseISO(century + year + '-' + month + '-' + padWithZero(day))

  if (!isValid(parsedDate) || isFuture(parsedDate) || exceedsMaximumAge(parsedDate)) {
    return false
  }

  return isCheckDigitValid(year + month + incrementedDay + birthDigits)
}

const isCheckDigitValid = (value: string): boolean => {
  const checkDigit = toNumber(value.substring(value.length - 1))

  return checkDigit === calculateCheckDigit(value)
}

export const calculateCheckDigit = (value: string): number => {
  // Check digit is calculated by
  //   1. multiplying each of the digits (except the control digit) with 2,1,2,1,...
  //   2. splitting up all products and sum up each digit in the result
  //   3. subtract sum from closest higher denary, or from itself if is evenly divisible by 10

  const multipliedDigits = value
    .substring(0, value.length - 1)
    .split('')
    .map((digit: string, idx: number) => {
      const multiplier = idx % 2 === 0 ? 2 : 1
      return toNumber(digit) * multiplier
    })
    .join('')

  const sum = multipliedDigits.split('').reduce((previous, current) => previous + toNumber(current), 0)

  return (10 - (sum % 10)) % 10
}

const exceedsMaximumAge = (start: Date): boolean => {
  const durationFromToday = intervalToDuration({
    start,
    end: new Date(),
  })
  return durationFromToday.years ? durationFromToday.years > MAXIMUM_AGE : false
}

const padWithZero = (number: number): string => (number < 10 ? '0' + number : number.toString())

const toNumber = (input: string): number => parseInt(input, 10)
