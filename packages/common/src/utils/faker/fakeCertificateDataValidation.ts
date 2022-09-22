import { CertificateDataValidation, CertificateDataValidationType } from '@frontend/common'
import faker from 'faker'
import { ValidationError } from '../../types/certificate'

export const fakeCertificateDataValidation = (data?: Partial<CertificateDataValidation>): CertificateDataValidation => {
  return {
    type: CertificateDataValidationType.TEXT_VALIDATION,
    questionId: '',
    expression: '',
    ...data,
  }
}

export const fakeCertificateValidationError = (data?: Partial<ValidationError>): ValidationError => {
  return {
    id: data?.id ?? faker.random.alpha({ count: 5 }),
    category: data?.category ?? faker.random.alpha({ count: 5 }),
    field: data?.field ?? faker.random.alpha({ count: 5 }),
    type: data?.field ?? faker.random.alpha({ count: 5 }),
    text: data?.field ?? faker.lorem.sentence(),
    ...data,
  }
}
