import { CertificateDataValidation, CertificateDataValidationType } from '@frontend/common'

export const fakeCertificateDataValidation = (data?: Partial<CertificateDataValidation>): CertificateDataValidation => {
  return {
    type: CertificateDataValidationType.TEXT_VALIDATION,
    questionId: '',
    expression: '',
    ...data,
  }
}
