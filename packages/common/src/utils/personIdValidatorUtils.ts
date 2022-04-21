export const isPersonIdValid = (patientId: string): boolean => {
  const cleanPatientId = patientId.replace('-', '')
  const numbers = cleanPatientId.match(/^(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)$/)
  let checkSum = 0

  if (numbers == null) {
    return false
  }

  let n
  for (let i = 3; i <= 12; i++) {
    n = parseInt(numbers[i])
    if (i % 2 === 0) {
      checkSum += n
    } else {
      checkSum += ((n * 2) % 9) + Math.floor(n / 9) * 9
    }
  }

  return checkSum % 10 === 0
}

export const formatPersonId = (id: string) => {
  let cleanId = id.replace(/\D/g, '')
  if (cleanId.length > 8) {
    cleanId = cleanId.slice(0, 8) + '-' + cleanId.slice(8, cleanId.length)
  }
  return cleanId
}
