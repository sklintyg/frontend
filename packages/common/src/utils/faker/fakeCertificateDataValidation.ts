import faker from 'faker'
import { CertificateDataValidation, CertificateDataValidationType, ValidationError } from '../../types/certificate'
import { PartialDeep } from 'type-fest'

export const fakeCertificateDataValidation = (data?: PartialDeep<CertificateDataValidation>): CertificateDataValidation => {
  return {
    type: CertificateDataValidationType.TEXT_VALIDATION,
    questionId: faker.random.alpha({ count: 5 }),
    expression: '',
    ...data,
    questions: data?.questions ? data?.questions.map(fakeCertificateDataValidation) : undefined,
  }
}

export const fakeCertificateValidationError = (data?: Partial<ValidationError>): ValidationError => {
  return {
    id: faker.random.alpha({ count: 5 }),
    category: faker.random.alpha({ count: 5 }),
    field: faker.random.alpha({ count: 5 }),
    type: faker.random.alpha({ count: 5 }),
    text: faker.lorem.sentence(),
    ...data,
  }
}
