import { CertificateDataElement, CertificateDataValidation } from '../../types'

export interface ValidationResult {
  element: CertificateDataElement
  result: boolean
  validation: CertificateDataValidation
}
