import type { CertificateData, ValidationError } from '../../types'

export function mapValidationErrorsToCertificateData(data: CertificateData, validationErrors: ValidationError[]) {
  // TODO: Replace with Object.groupBy once fully supported
  // example: const errorMap = Object.groupBy(validationErrors, (error) => error.id);
  const errorMap = validationErrors.reduce<Record<string, ValidationError[]>>((acc, error) => {
    acc[error.id] = acc[error.id] || []
    acc[error.id].push(error)
    return acc
  }, {})

  return Object.fromEntries(
    Object.entries(data).map(([elementId, element]) => [elementId, { ...element, validationErrors: errorMap[elementId] || [] }])
  )
}
