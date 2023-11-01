import faker from 'faker'
import {
  AutoFillValidation,
  CategoryMandatoryValidation,
  CertificateDataValidationType,
  DisableSubElementValidation,
  DisableValidation,
  EnableValidation,
  HideValidation,
  HighlightValidation,
  MandatoryValidation,
  ShowValidation,
  TextValidation,
  ValidationError,
} from '../../types/certificate'
import { fakeCertificateValue } from './fakeCertificateValue'

export const fakeTextValidation = (data?: Partial<TextValidation>): TextValidation => ({
  type: CertificateDataValidationType.TEXT_VALIDATION,
  questionId: faker.random.alpha({ count: 5 }),
  id: faker.random.alpha({ count: 5 }),
  limit: faker.datatype.number(),
  ...data,
})

export const fakeAutoFillValidation = (data?: Partial<AutoFillValidation>): AutoFillValidation => ({
  type: CertificateDataValidationType.AUTO_FILL_VALIDATION,
  questionId: faker.random.alpha({ count: 5 }),
  id: faker.random.alpha({ count: 5 }),
  fillValue: fakeCertificateValue.text(),
  ...data,
})

export const fakeShowValidation = (data?: Partial<ShowValidation>): ShowValidation => ({
  type: CertificateDataValidationType.SHOW_VALIDATION,
  questionId: faker.random.alpha({ count: 5 }),
  ...data,
})

export const fakeHideValidation = (data?: Partial<HideValidation>): HideValidation => ({
  type: CertificateDataValidationType.HIDE_VALIDATION,
  questionId: faker.random.alpha({ count: 5 }),
  ...data,
})

export const fakeDisableValidation = (data?: Partial<DisableValidation>): DisableValidation => ({
  type: CertificateDataValidationType.DISABLE_VALIDATION,
  questionId: faker.random.alpha({ count: 5 }),
  id: [faker.random.alpha({ count: 5 })],
  ...data,
})

export const fakeDisableSubElementValidation = (data?: Partial<DisableSubElementValidation>): DisableSubElementValidation => ({
  type: CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION,
  questionId: faker.random.alpha({ count: 5 }),
  id: [faker.random.alpha({ count: 5 })],
  ...data,
})

export const fakeEnableValidation = (data?: Partial<EnableValidation>): EnableValidation => ({
  type: CertificateDataValidationType.ENABLE_VALIDATION,
  questionId: faker.random.alpha({ count: 5 }),
  ...data,
})

export const fakeMandatoryValidation = (data?: Partial<MandatoryValidation>): MandatoryValidation => ({
  type: CertificateDataValidationType.MANDATORY_VALIDATION,
  questionId: faker.random.alpha({ count: 5 }),
  ...data,
})

export const fakeCategoryMandatoryValidation = (data?: Partial<CategoryMandatoryValidation>): CategoryMandatoryValidation => ({
  type: CertificateDataValidationType.CATEGORY_MANDATORY_VALIDATION,
  questionId: faker.random.alpha({ count: 5 }),
  ...data,
})

export const fakeHighlightValidation = (data?: Partial<HighlightValidation>): HighlightValidation => ({
  type: CertificateDataValidationType.HIGHLIGHT_VALIDATION,
  questionId: faker.random.alpha({ count: 5 }),
  ...data,
})

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
