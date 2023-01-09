export const parseAcuity = (acuityValue: string): string => {
  const value = Math.min(parseFloat(acuityValue.replace(',', '.')), 99)
  if (isNaN(value)) {
    return ''
  }

  const isInitialZero = acuityValue.length === 2 && acuityValue.charAt(0) === '0'
  const formatted = new Intl.NumberFormat('sv-SE').format(value >= 10 || isInitialZero ? value * 0.1 : value)

  return value.toString() === formatted ? acuityValue : formatted
}
