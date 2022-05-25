import { intervalToDuration, isFuture, isValid, parseISO } from 'date-fns'

const MAXIMUM_AGE = 125

export const isPersonIdValid = (id: string): boolean => isPersonnummerValid(id) || isSamordningsnummerValid(id)

export const formatPersonId = (id: string): string => {
  let cleanId = id.replace(/\D/g, '')
  if (cleanId.length > 8) {
    cleanId = cleanId.slice(0, 8) + '-' + cleanId.slice(8, cleanId.length)
  }
  return cleanId
}

const isPersonnummerValid = (value: string): boolean => {
  const PERSONNUMMER_REGEXP = /^(\d{2})(\d{2})(\d{2})([0-3]\d)([-+]?)(\d{4})$/
  const parts = PERSONNUMMER_REGEXP.exec(value)

  if (!parts) return false

  const parsedDate = parseISO(parts[1] + parts[2] + '-' + parts[3] + '-' + parts[4])

  if (!isValid(parsedDate) || isFuture(parsedDate) || !isDateInValidRange(parsedDate)) {
    return false
  }

  return isCheckDigitValid(parts[2] + parts[3] + parts[4] + parts[6])
}

const isSamordningsnummerValid = (value: string): boolean => {
  const SAMORDNINGSNUMMER_REGEXP = /^(\d{2})(\d{2})(\d{2})([6-9]\d)-?(\d{4})$/
  const parts = SAMORDNINGSNUMMER_REGEXP.exec(value)

  if (!parts) return false

  const day = parseInt(parts[4], 10) - 60 // 60 is the special number for samordningsnummer.
  const parsedDate = parseISO(parts[1] + parts[2] + '-' + parts[3] + '-' + pad(day))

  if (!isValid(parsedDate) || isFuture(parsedDate) || !isDateInValidRange(parsedDate)) {
    return false
  }

  return isCheckDigitValid(parts[2] + parts[3] + parts[4] + parts[5])
}

const isCheckDigitValid = (value: string): boolean => {
  // Multiply each of the digits (except the control digit) with 2,1,2,1,...
  const multipliedDigits = value
    .substring(0, value.length - 1)
    .split('')
    .map((digit: string, idx: number) => {
      const multiplier = idx % 2 === 0 ? 2 : 1
      return parseInt(digit, 10) * multiplier
    })
    .join('')

  const sum = multipliedDigits.split('').reduce((prev: number, curr: string) => prev + parseInt(curr, 10), 0)
  const checkDigit = parseInt(value.substring(value.length - 1), 10)

  return (10 - (sum % 10)) % 10 === checkDigit
}

const isDateInValidRange = (start: Date): boolean => {
  // A date is not allowed to be greater than 125 years
  const durationFromToday = intervalToDuration({
    start,
    end: new Date(),
  })
  return durationFromToday.years ? durationFromToday.years < MAXIMUM_AGE + 1 : false
}

const pad = (number: number): string => (number < 10 ? '0' + number : number.toString())
