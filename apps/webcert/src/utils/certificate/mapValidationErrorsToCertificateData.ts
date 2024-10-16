import type { CertificateData, ValidationError } from '../../types'
import { isClientValidationError } from './getClientValidationErrors'

function extractClientValidationErrors(data: CertificateData): ValidationError[] {
  return Object.values(data).reduce<ValidationError[]>(
    (result, { validationErrors }) => [...result, ...validationErrors.filter((e) => isClientValidationError(e.type))],
    []
  )
}

export function mapValidationErrorsToCertificateData(data: CertificateData, validationErrors: ValidationError[]) {
  const errorMap = extractClientValidationErrors(data)
    .concat(validationErrors)
    .reduce<Record<string, ValidationError[]>>((acc, error) => {
      acc[error.id] = acc[error.id] || []
      acc[error.id].push(error)
      return acc
    }, {})

  return Object.fromEntries(
    Object.entries(data).map(([elementId, element]) => [elementId, { ...element, validationErrors: errorMap[elementId] || [] }])
  )
}
