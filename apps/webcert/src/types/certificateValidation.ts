import { ValueType } from './certificateDataValue'

export enum CertificateDataValidationType {
  TEXT_VALIDATION = 'TEXT_VALIDATION',
  SHOW_VALIDATION = 'SHOW_VALIDATION',
  HIDE_VALIDATION = 'HIDE_VALIDATION',
  DISABLE_VALIDATION = 'DISABLE_VALIDATION',
  DISABLE_SUB_ELEMENT_VALIDATION = 'DISABLE_SUB_ELEMENT_VALIDATION',
  ENABLE_VALIDATION = 'ENABLE_VALIDATION',
  MANDATORY_VALIDATION = 'MANDATORY_VALIDATION',
  CATEGORY_MANDATORY_VALIDATION = 'CATEGORY_MANDATORY_VALIDATION',
  DEFAULT_DATE_VALIDATION = 'DEFAULT_DATE_VALIDATION',
  HIGHLIGHT_VALIDATION = 'HIGHLIGHT_VALIDATION',
  AUTO_FILL_VALIDATION = 'AUTO_FILL_VALIDATION',
}

export type CertificateDataValidation =
  | AutoFillValidation
  | TextValidation
  | ShowValidation
  | HideValidation
  | DisableValidation
  | DisableSubElementValidation
  | EnableValidation
  | MandatoryValidation
  | CategoryMandatoryValidation
  | HighlightValidation
interface CertificateDataValidationBase<T extends CertificateDataValidationType> {
  type: T
  questionId: string
  id?: string | string[]
  expression?: string
  expressionType?: string
  questions?: CertificateDataValidation[]
}

export interface AutoFillValidation extends CertificateDataValidationBase<CertificateDataValidationType.AUTO_FILL_VALIDATION> {
  id: string
  fillValue: ValueType
}

export interface TextValidation extends CertificateDataValidationBase<CertificateDataValidationType.TEXT_VALIDATION> {
  id: string
  limit: number
}

export type ShowValidation = CertificateDataValidationBase<CertificateDataValidationType.SHOW_VALIDATION>

export type HideValidation = CertificateDataValidationBase<CertificateDataValidationType.HIDE_VALIDATION>

export interface DisableValidation extends CertificateDataValidationBase<CertificateDataValidationType.DISABLE_VALIDATION> {
  id: string[] // 'KV_FKMU_0004.ARBETSTRANING, KV_FKMU_0004.ERGONOMISK,'
}

export interface DisableSubElementValidation
  extends CertificateDataValidationBase<CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION> {
  id: string[]
}

export type EnableValidation = CertificateDataValidationBase<CertificateDataValidationType.ENABLE_VALIDATION>

export type MandatoryValidation = CertificateDataValidationBase<CertificateDataValidationType.MANDATORY_VALIDATION>

export type CategoryMandatoryValidation = CertificateDataValidationBase<CertificateDataValidationType.CATEGORY_MANDATORY_VALIDATION>

export type HighlightValidation = CertificateDataValidationBase<CertificateDataValidationType.HIGHLIGHT_VALIDATION>
