export const isPatientIdValid = (patientId: string): boolean => {
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
