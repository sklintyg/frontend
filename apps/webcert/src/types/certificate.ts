import type { CertificateConfirmationModal } from './confirmModal'
import type { Patient } from './patient'
import type { QuestionType } from './question'
import type { ResourceLink } from './resourceLink'

export interface Certificate {
  metadata: CertificateMetadata
  data: CertificateData
  links: ResourceLink[]
}

export enum CertificateStatus {
  UNSIGNED = 'UNSIGNED',
  LOCKED = 'LOCKED',
  SIGNED = 'SIGNED',
  REVOKED = 'REVOKED',
  LOCKED_REVOKED = 'LOCKED_REVOKED',
}

export interface CertificateMetadata {
  id: string
  name: string
  description: string
  type: string
  typeVersion: string
  typeName?: string
  status: CertificateStatus
  sent: boolean
  sentTo?: string
  created: string
  testCertificate: boolean
  forwarded: boolean
  readyForSign?: string
  relations: CertificateRelations
  unit: Unit
  careUnitValidationErrors?: ValidationError[]
  patientValidationErrors?: ValidationError[]
  careUnit: Unit
  careProvider: Unit
  patient: Patient
  issuedBy: Staff
  version: number
  latestMajorVersion: boolean
  responsibleHospName: string
  signed?: string
  messageTypes?: MessageType[]
  confirmationModal: CertificateConfirmationModal | null
}

export type MessageType = {
  type: QuestionType
  subject: string
}

export type CertificateData = Record<string, CertificateDataElement>

export interface CertificateDataElement {
  id: string
  parent: string
  index: number
  visible?: boolean
  disabled?: boolean
  readOnly: boolean
  mandatory: boolean
  config: CertificateDataConfigType
  value: ValueType | null
  validation: CertificateDataValidation[]
  validationErrors: ValidationError[]
  style?: CertificateDataElementStyleEnum
}

export enum CertificateDataElementStyleEnum {
  NORMAL = 'NORMAL',
  HIGHLIGHTED = 'HIGHLIGHTED',
  HIDDEN = 'HIDDEN',
}

// Configs
export enum ConfigTypes {
  CATEGORY = 'CATEGORY',
  UE_CHECKBOX_BOOLEAN = 'UE_CHECKBOX_BOOLEAN',
  UE_CHECKBOX_CODE = 'UE_CHECKBOX_CODE',
  UE_CHECKBOX_DATE = 'UE_CHECKBOX_DATE',
  UE_CHECKBOX_MULTIPLE_CODE = 'UE_CHECKBOX_MULTIPLE_CODE',
  UE_CHECKBOX_MULTIPLE_DATE = 'UE_CHECKBOX_MULTIPLE_DATE',
  UE_CHECKBOX_MULTIPLE_DATE_RANGE = 'UE_CHECKBOX_MULTIPLE_DATE_RANGE',
  UE_DATE = 'UE_DATE',
  UE_DATE_RANGE = 'UE_DATE_RANGE',
  UE_DIAGNOSES = 'UE_DIAGNOSES',
  UE_DROPDOWN = 'UE_DROPDOWN',
  UE_RADIO_BOOLEAN = 'UE_RADIO_BOOLEAN',
  UE_RADIO_CODE = 'UE_RADIO_CODE',
  UE_RADIO_MULTIPLE_CODE = 'UE_RADIO_MULTIPLE_CODE',
  UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN = 'UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN',
  UE_CHECKBOX_DATE_RANGE_LIST = 'UE_CHECKBOX_DATE_RANGE_LIST',
  UE_TEXTAREA = 'UE_TEXTAREA',
  UE_ICF = 'UE_ICF',
  UE_UNCERTAIN_DATE = 'UE_UNCERTAIN_DATE',
  UE_TEXTFIELD = 'UE_TEXTFIELD',
  UE_TYPE_AHEAD = 'UE_TYPE_AHEAD',
  UE_MESSAGE = 'UE_MESSAGE',
  UE_HEADER = 'UE_HEADER',
  UE_MEDICAL_INVESTIGATION = 'UE_MEDICAL_INVESTIGATION',
  UE_CAUSE_OF_DEATH = 'UE_CAUSE_OF_DEATH',
  UE_CAUSE_OF_DEATH_LIST = 'UE_CAUSE_OF_DEATH_LIST',
  UE_VISUAL_ACUITY = 'UE_VISUAL_ACUITY',
  UE_VIEW_TEXT = 'UE_VIEW_TEXT',
  UE_VIEW_LIST = 'UE_VIEW_LIST',
  UE_VIEW_TABLE = 'UE_VIEW_TABLE',
  UE_YEAR = 'UE_YEAR',
  UE_INTEGER = 'UE_INTEGER',
}

export type CertificateDataConfigType =
  | ConfigCategory
  | ConfigUeCauseOfDeath
  | ConfigUeCauseOfDeathList
  | ConfigUeCheckboxBoolean
  | ConfigUeCheckboxDate
  | ConfigUeCheckboxDateRange
  | ConfigUeCheckboxDateRangeList
  | ConfigUeCheckboxMultipleCodes
  | ConfigUeCheckboxMultipleDate
  | ConfigUeDate
  | ConfigUeDateRange
  | ConfigUeDiagnoses
  | ConfigUeDropdown
  | ConfigUeHeader
  | ConfigUeIcf
  | ConfigUeInteger
  | ConfigUeMedicalInvestigationList
  | ConfigUeMessage
  | ConfigUeRadioBoolean
  | ConfigUeRadioCode
  | ConfigUeRadioMultipleCodes
  | ConfigUeRadioMultipleCodesOptionalDropdown
  | ConfigUeTextArea
  | ConfigUeTextField
  | ConfigUeTypeahead
  | ConfigUeUncertainDate
  | ConfigUeViewList
  | ConfigUeViewTable
  | ConfigUeViewText
  | ConfigUeVisualAcuity
  | ConfigUeYear

export enum MessageLevel {
  INFO = 'INFO',
  OBSERVE = 'OBSERVE',
  ERROR = 'ERROR',
}

export interface ConfigMessage {
  level: MessageLevel
  content: string
}

export interface CertificateDataConfig {
  header?: string
  icon?: string
  text: string
  label?: string
  description: string
  type: ConfigTypes
  accordion?: ConfigAccordion
  list?: unknown
  message?: ConfigMessage
}

export interface ConfigAccordion {
  openText: string
  closeText: string
  header?: string
}

export interface ConfigCategory extends CertificateDataConfig {
  type: ConfigTypes.CATEGORY
}

export interface ConfigUeTextArea extends CertificateDataConfig {
  type: ConfigTypes.UE_TEXTAREA
  id: string
  label?: string
}

export interface ConfigUeTextField extends CertificateDataConfig {
  type: ConfigTypes.UE_TEXTFIELD
  id: string
}

export interface ConfigUeRadioBoolean extends CertificateDataConfig {
  type: ConfigTypes.UE_RADIO_BOOLEAN
  id: string
  selectedText: string
  unselectedText: string
}

export interface ConfigUeCheckboxBoolean extends CertificateDataConfig {
  type: ConfigTypes.UE_CHECKBOX_BOOLEAN
  id: string
  label: string
  selectedText: string
  unselectedText: string
}

export interface ConfigUeMessage extends CertificateDataConfig {
  type: ConfigTypes.UE_MESSAGE
  id: string
  message: ConfigMessage
}

export interface ConfigUeTypeahead extends CertificateDataConfig {
  type: ConfigTypes.UE_TYPE_AHEAD
  id: string
  typeAhead: string[]
  text: string
  label: string
  placeholder?: string
}

export interface CheckboxCode {
  id: string
  label: string
  disabled?: boolean
}

export enum ConfigLayout {
  ROWS = 'ROWS',
  INLINE = 'INLINE',
  COLUMN = 'COLUMN',
  COLUMNS = 'COLUMNS',
}

export interface ConfigUeCheckboxMultipleCodes extends CertificateDataConfig {
  type: ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE
  list: CheckboxCode[]
  layout: ConfigLayout
}

export interface ConfigUeRadioCode extends CertificateDataConfig {
  type: ConfigTypes.UE_RADIO_CODE
  id: string
  label: string
}

export interface ConfigUeRadioCodeOptionalDropdown {
  id: string
  label: string
  dropdownQuestionId: string
}

export interface ConfigUeRadioMultipleCodes extends CertificateDataConfig {
  type: ConfigTypes.UE_RADIO_MULTIPLE_CODE
  id: string
  list: ConfigUeRadioCode[]
  layout: ConfigLayout
}

export interface ConfigUeRadioMultipleCodesOptionalDropdown extends CertificateDataConfig {
  type: ConfigTypes.UE_RADIO_MULTIPLE_CODE_OPTIONAL_DROPDOWN
  id: string
  list: ConfigUeRadioCodeOptionalDropdown[]
}

export interface ConfigUeCheckboxDate extends CertificateDataConfig {
  type: ConfigTypes.UE_CHECKBOX_DATE
  id: string
  label: string
  maxDate?: string
  minDate?: string
}

export interface ConfigUeCheckboxDateRange extends CertificateDataConfig {
  type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE_RANGE
  id: string
  label: string
}

export interface ConfigUeCheckboxMultipleDate extends CertificateDataConfig {
  type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE
  list: ConfigUeCheckboxDate[]
}

export interface ConfigUeCheckboxDateRangeList extends CertificateDataConfig {
  type: ConfigTypes.UE_CHECKBOX_DATE_RANGE_LIST
  list: ConfigUeCheckboxDateRange[]
  label?: string
  previousDateRangeText?: string
  hideWorkingHours: boolean
  min?: string
  max?: string
}

export interface ConfigUeDiagnosisTerminology {
  id: string
  label: string
}

export interface ConfigUeDiagnosisId {
  id: string
}

export interface ConfigUeDiagnoses extends CertificateDataConfig {
  type: ConfigTypes.UE_DIAGNOSES
  terminology: ConfigUeDiagnosisTerminology[]
  list: ConfigUeDiagnosisId[]
}

export interface ConfigUeDropdownItem {
  id: string
  label: string
}

export interface ConfigUeDropdown extends CertificateDataConfig {
  type: ConfigTypes.UE_DROPDOWN
  list: ConfigUeDropdownItem[]
  label?: string
}

export interface ConfigUeDate extends CertificateDataConfig {
  type: ConfigTypes.UE_DATE
  id: string
  maxDate?: string
  minDate?: string
}

export interface ConfigUeDateRange extends CertificateDataConfig {
  id: string
  type: ConfigTypes.UE_DATE_RANGE
  fromLabel: string
  toLabel: string
}

export interface ConfigUeIcf extends CertificateDataConfig {
  type: ConfigTypes.UE_ICF
  id: string
  label: string
  modalLabel: string
  collectionsLabel: string
  placeholder: string
}

export interface ConfigUeHeader extends CertificateDataConfig {
  type: ConfigTypes.UE_HEADER
  id: string
  label: string
}

export interface ConfigUeUncertainDate extends CertificateDataConfig {
  type: ConfigTypes.UE_UNCERTAIN_DATE
  id: string
  label: string
  allowedYears: string[]
  unknownYear: boolean
  unknownMonth: boolean
}

export interface ConfigUeCodeItem {
  id: string
  label: string
  code: string | null
}

export interface ConfigUeMedicalInvestigation {
  investigationTypeId: string
  informationSourceId: string
  dateId: string
  typeOptions: ConfigUeCodeItem[]
  maxDate?: string
  minDate?: string
}

export interface ConfigUeMedicalInvestigationList extends CertificateDataConfig {
  type: ConfigTypes.UE_MEDICAL_INVESTIGATION
  typeText: string
  dateText: string
  informationSourceText: string
  informationSourceDescription: string
  list: ConfigUeMedicalInvestigation[]
}

export interface ConfigUeCauseOfDeathControl {
  id: string
  descriptionId: string
  debutId: string
  specifications: ConfigUeCodeItem[]
  maxDate?: string
  minDate?: string
}

export interface ConfigUeCauseOfDeath extends CertificateDataConfig {
  title: string
  type: ConfigTypes.UE_CAUSE_OF_DEATH
  label?: string
  causeOfDeath: ConfigUeCauseOfDeathControl
}

export interface ConfigUeCauseOfDeathList extends CertificateDataConfig {
  type: ConfigTypes.UE_CAUSE_OF_DEATH_LIST
  itemCount?: number
  list: ConfigUeCauseOfDeathControl[]
}

export interface ConfigEyeAcuity {
  label: string
  withoutCorrectionId: string
  withCorrectionId: string
  contactLensesId?: string
}

export interface ConfigUeVisualAcuity extends CertificateDataConfig {
  type: ConfigTypes.UE_VISUAL_ACUITY
  withoutCorrectionLabel: string
  withCorrectionLabel: string
  contactLensesLabel: string
  rightEye: ConfigEyeAcuity
  leftEye: ConfigEyeAcuity
  binocular: ConfigEyeAcuity
}

export interface ConfigUeViewText extends CertificateDataConfig {
  type: ConfigTypes.UE_VIEW_TEXT
  label?: string
}

export interface ConfigUeViewList extends CertificateDataConfig {
  type: ConfigTypes.UE_VIEW_LIST
  label?: string
}

export interface ConfigViewColumn {
  id: string
  text: string
}

export interface ConfigUeViewTable extends CertificateDataConfig {
  type: ConfigTypes.UE_VIEW_TABLE
  columns: ConfigViewColumn[]
}

export interface ConfigUeYear extends CertificateDataConfig {
  id: string
  type: ConfigTypes.UE_YEAR
  minYear?: number
  maxYear?: number
}

export interface ConfigUeInteger extends CertificateDataConfig {
  type: ConfigTypes.UE_INTEGER
  id: string
  unitOfMeasurement?: string
  min?: number
  max?: number
}

// Values
export enum CertificateDataValueType {
  BOOLEAN = 'BOOLEAN',
  CODE = 'CODE',
  CODE_LIST = 'CODE_LIST',
  DATE = 'DATE',
  DATE_LIST = 'DATE_LIST',
  DATE_RANGE = 'DATE_RANGE',
  DATE_RANGE_LIST = 'DATE_RANGE_LIST',
  DIAGNOSIS = 'DIAGNOSIS',
  DIAGNOSIS_LIST = 'DIAGNOSIS_LIST',
  ICF = 'ICF',
  TEXT = 'TEXT',
  DOUBLE = 'DOUBLE',
  UNKNOWN = 'UNKNOWN',
  HEADER = 'HEADER',
  UNCERTAIN_DATE = 'UNCERTAIN_DATE',
  MEDICAL_INVESTIGATION = 'MEDICAL_INVESTIGATION',
  MEDICAL_INVESTIGATION_LIST = 'MEDICAL_INVESTIGATION_LIST',
  CAUSE_OF_DEATH = 'CAUSE_OF_DEATH',
  CAUSE_OF_DEATH_LIST = 'CAUSE_OF_DEATH_LIST',
  VISUAL_ACUITIES = 'VISUAL_ACUITIES',
  VISUAL_ACUITY = 'VISUAL_ACUITY',
  VIEW_TEXT = 'VIEW_TEXT',
  VIEW_LIST = 'VIEW_LIST',
  VIEW_ROW = 'VIEW_ROW',
  VIEW_TABLE = 'VIEW_TABLE',
  YEAR = 'YEAR',
  INTEGER = 'INTEGER',
}

export type ValueType =
  | ValueBoolean
  | ValueCauseOfDeath
  | ValueCauseOfDeathList
  | ValueCode
  | ValueCodeList
  | ValueDate
  | ValueDateList
  | ValueDateRange
  | ValueDateRangeList
  | ValueDiagnosis
  | ValueDiagnosisList
  | ValueDouble
  | ValueHeader
  | ValueIcf
  | ValueText
  | ValueUncertainDate
  | ValueEyeAcuity
  | ValueVisualAcuity
  | ValueMedicalInvestigation
  | ValueMedicalInvestigationList
  | ValueViewText
  | ValueViewList
  | ValueViewTable
  | ValueYear
  | ValueInteger
  | ValueUnknown

export interface ValueUnknown {
  type: CertificateDataValueType.UNKNOWN
}

export interface ValueBoolean {
  type: CertificateDataValueType.BOOLEAN
  id: string
  selected: boolean | null | undefined
}

export interface ValueCode {
  type: CertificateDataValueType.CODE
  id: string
  code?: string
}

export interface ValueDate {
  type: CertificateDataValueType.DATE
  id: string
  date?: string
}

export interface ValueDateList {
  type: CertificateDataValueType.DATE_LIST
  list: ValueDate[]
}

export interface ValueDateRange {
  type: CertificateDataValueType.DATE_RANGE
  id: string
  from?: string
  to?: string
}

export interface ValueDateRangeList {
  type: CertificateDataValueType.DATE_RANGE_LIST
  list: ValueDateRange[]
}

export interface ValueDiagnosis {
  type: CertificateDataValueType.DIAGNOSIS
  id: string
  terminology: string
  code: string
  description: string
}

export interface ValueDiagnosisList {
  type: CertificateDataValueType.DIAGNOSIS_LIST
  list: ValueDiagnosis[]
}

export interface ValueCodeList {
  type: CertificateDataValueType.CODE_LIST
  list: ValueCode[]
}

export interface ValueText {
  type: CertificateDataValueType.TEXT
  text?: string | null
  id: string
}

export interface ValueDouble {
  type: CertificateDataValueType.DOUBLE
  value: number | null
  id: string
}

export interface ValueUncertainDate {
  type: CertificateDataValueType.UNCERTAIN_DATE
  id: string
  value: string | null
}

export interface ValueCauseOfDeath {
  type: CertificateDataValueType.CAUSE_OF_DEATH
  id: string
  description: ValueText
  debut: ValueDate
  specification: ValueCode
}

export interface ValueCauseOfDeathList {
  type: CertificateDataValueType.CAUSE_OF_DEATH_LIST
  list: ValueCauseOfDeath[]
}

export interface ValueIcf {
  type: CertificateDataValueType.ICF
  id: string
  icfCodes?: string[]
  text: string | null
}

export interface ValueHeader {
  type: CertificateDataValueType.HEADER
  id: string
}

export interface ValueMedicalInvestigation {
  type: CertificateDataValueType.MEDICAL_INVESTIGATION
  investigationType: ValueCode
  date: ValueDate
  informationSource: ValueText
}

export interface ValueMedicalInvestigationList {
  type: CertificateDataValueType.MEDICAL_INVESTIGATION_LIST
  list: ValueMedicalInvestigation[]
}

export interface ValueEyeAcuity {
  type: CertificateDataValueType.VISUAL_ACUITY
  withoutCorrection: ValueDouble
  withCorrection: ValueDouble
  contactLenses?: ValueBoolean
}

export interface ValueVisualAcuity {
  type: CertificateDataValueType.VISUAL_ACUITIES
  rightEye: ValueEyeAcuity
  leftEye: ValueEyeAcuity
  binocular: ValueEyeAcuity
}

export interface ValueViewText {
  type: CertificateDataValueType.VIEW_TEXT
  text: string
}

export interface ValueViewList {
  type: CertificateDataValueType.VIEW_LIST
  list: ValueViewText[]
}

export interface ValueTextRow {
  type: CertificateDataValueType.VIEW_ROW
  columns: ValueText[]
}

export interface ValueViewTable {
  type: CertificateDataValueType.VIEW_TABLE
  rows: ValueTextRow[]
}

export interface ValueYear {
  type: CertificateDataValueType.YEAR
  id: string
  year?: number | string
}

export interface ValueInteger {
  type: CertificateDataValueType.INTEGER
  id: string
  value: number | null
}

// Validation

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

// --------------------------------------------
export interface ValidationError {
  id: string
  category: string
  field: string
  type: string
  text: string
  showAlways?: boolean
}

export interface Unit {
  unitId: string
  unitName: string
  address: string
  zipCode: string
  city: string
  phoneNumber: string
  email: string
  isInactive: boolean
}

export interface Staff {
  personId: string
  fullName: string
  prescriptionCode: string
}

export interface CertificateRelations {
  parent: CertificateRelation | null
  children: CertificateRelation[]
}

export interface CertificateRelation {
  certificateId: string
  created: string
  status: CertificateStatus
  type: CertificateRelationType
}

export enum CertificateRelationType {
  REPLACED = 'REPLACED',
  COPIED = 'COPIED',
  RENEW = 'RENEW',
  COMPLEMENTED = 'COMPLEMENTED',
  EXTENDED = 'EXTENDED',
}

export interface CertificateEvent {
  certificateId: string
  type: CertificateEventType
  timestamp: string
  relatedCertificateId: string | null
  relatedCertificateStatus: CertificateStatus | null
}

export enum CertificateEventType {
  CREATED = 'CREATED',
  DELETED = 'DELETED',
  LOCKED = 'LOCKED',
  READY_FOR_SIGN = 'READY_FOR_SIGN',
  SIGNED = 'SIGNED',
  SENT = 'SENT',
  AVAILABLE_FOR_PATIENT = 'AVAILABLE_FOR_PATIENT',
  INCOMING_MESSAGE = 'INCOMING_MESSAGE',
  INCOMING_MESSAGE_HANDLED = 'INCOMING_MESSAGE_HANDLED',
  OUTGOING_MESSAGE = 'OUTGOING_MESSAGE',
  OUTGOING_MESSAGE_HANDLED = 'OUTGOING_MESSAGE_HANDLED',
  INCOMING_ANSWER = 'INCOMING_ANSWER',
  INCOMING_MESSAGE_REMINDER = 'INCOMING_MESSAGE_REMINDER',
  REQUEST_FOR_COMPLEMENT = 'REQUEST_FOR_COMPLEMENT',

  REVOKED = 'REVOKED',
  REPLACED = 'REPLACED',
  REPLACES = 'REPLACES',
  RENEWAL_OF = 'RENEWAL_OF',
  COMPLEMENTS = 'COMPLEMENTS',
  COMPLEMENTED = 'COMPLEMENTED',
  EXTENDED = 'EXTENDED',
  CREATED_FROM = 'CREATED_FROM',
  COPIED_BY = 'COPIED_BY',
  COPIED_FROM = 'COPIED_FROM',
  RELATED_CERTIFICATE_REVOKED = 'RELATED_CERTIFICATE_REVOKED',
}

export interface IcfTitles {
  activityLimitation: {
    unique: string[]
    common: string[]
  }
  disability: {
    unique: string[]
    common: string[]
  }
}

export enum CertificateSignStatus {
  INITIAL = '',
  UNKNOWN = 'OKAND',
  PROCESSING = 'BEARBETAR',
  NO_CLIENT = 'NO_CLIENT',
  SIGNED = 'SIGNERAD',
  FAILED = 'FAILED',
}
