export const formatAcuity = (value: string): string => {
  const num = Math.min(parseFloat(value.replace(',', '.')), 99)
  if (isNaN(num)) {
    return ''
  }

  const isInitialZero = value.length === 2 && value.charAt(0) === '0'
  const formatted = new Intl.NumberFormat('sv-SE').format(num >= 10 || isInitialZero ? num * 0.1 : num)

  return num.toString() === formatted ? value.replace('.', ',') : formatted
}

export const formatFixed = (value: string) => {
  return value ? parseFloat(value.replace(',', '.')).toFixed(1).replace('.', ',') : ''
}
