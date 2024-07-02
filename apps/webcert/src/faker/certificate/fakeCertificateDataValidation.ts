import faker from 'faker'
import type {
  AutoFillValidation,
  CategoryMandatoryValidation,
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
import { CertificateDataValidationType } from '../../types/certificate'
import { fakeId } from '../fakeId'
import { fakeCertificateValue } from './fakeCertificateValue'

export const fakeTextValidation = (data?: Partial<TextValidation>): TextValidation => ({
  type: CertificateDataValidationType.TEXT_VALIDATION,
  questionId: fakeId(),
  id: fakeId(),
  limit: faker.datatype.number(),
  ...data,
})

export const fakeAutoFillValidation = (data?: Partial<AutoFillValidation>): AutoFillValidation => ({
  type: CertificateDataValidationType.AUTO_FILL_VALIDATION,
  questionId: fakeId(),
  id: fakeId(),
  fillValue: fakeCertificateValue.text(),
  ...data,
})

export const fakeShowValidation = (data?: Partial<ShowValidation>): ShowValidation => ({
  type: CertificateDataValidationType.SHOW_VALIDATION,
  questionId: fakeId(),
  ...data,
})

export const fakeHideValidation = (data?: Partial<HideValidation>): HideValidation => ({
  type: CertificateDataValidationType.HIDE_VALIDATION,
  questionId: fakeId(),
  ...data,
})

export const fakeDisableValidation = (data?: Partial<DisableValidation>): DisableValidation => ({
  type: CertificateDataValidationType.DISABLE_VALIDATION,
  questionId: fakeId(),
  id: [fakeId()],
  ...data,
})

export const fakeDisableSubElementValidation = (data?: Partial<DisableSubElementValidation>): DisableSubElementValidation => ({
  type: CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION,
  questionId: fakeId(),
  id: [fakeId()],
  ...data,
})

export const fakeEnableValidation = (data?: Partial<EnableValidation>): EnableValidation => ({
  type: CertificateDataValidationType.ENABLE_VALIDATION,
  questionId: fakeId(),
  ...data,
})

export const fakeMandatoryValidation = (data?: Partial<MandatoryValidation>): MandatoryValidation => ({
  type: CertificateDataValidationType.MANDATORY_VALIDATION,
  questionId: fakeId(),
  ...data,
})

export const fakeCategoryMandatoryValidation = (data?: Partial<CategoryMandatoryValidation>): CategoryMandatoryValidation => ({
  type: CertificateDataValidationType.CATEGORY_MANDATORY_VALIDATION,
  questionId: fakeId(),
  ...data,
})

export const fakeHighlightValidation = (data?: Partial<HighlightValidation>): HighlightValidation => ({
  type: CertificateDataValidationType.HIGHLIGHT_VALIDATION,
  questionId: fakeId(),
  ...data,
})

export const fakeCertificateValidationError = (data?: Partial<ValidationError>): ValidationError => {
  return {
    id: fakeId(),
    category: fakeId(),
    field: fakeId(),
    type: fakeId(),
    text: faker.lorem.sentence(),
    ...data,
  }
}
