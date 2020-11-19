import { ResourceLink } from './resourceLink'

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
  certificateId: string
  certificateName: string
  certificateDescription: string
  certificateType: string
  certificateTypeVersion: string
  certificateStatus: CertificateStatus
  created: string
  testCertificate: boolean
  forwarded: boolean
  relations: CertificateRelations
  unit: Unit
  careProvider: Unit
  patient: Patient
  issuedBy: Staff
  version: number
}

export interface CertificateData {
  [propName: string]: CertificateDataElement
}

export interface CertificateDataElement {
  id: string
  parent: string
  index: number
  visible: boolean
  readOnly: boolean
  mandatory: boolean
  config: CertificateDataConfig
  value: CertificateDataValue
  validation: CertificateDataValidation
  validationErrors: ValidationError[]
}

// Configs
export enum ConfigTypes {
  CATEGORY = 'CATEGORY',
  UE_CHECKBOX_BOOLEAN = 'UE_CHECKBOX_BOOLEAN',
  UE_CHECKBOX_MULTIPLE_CODE = 'UE_CHECKBOX_MULTIPLE_CODE',
  UE_CHECKBOX_MULTIPLE_DATE = 'UE_CHECKBOX_MULTIPLE_DATE',
  UE_CHECKBOX_MULTIPLE_DATE_RANGE = 'UE_CHECKBOX_MULTIPLE_DATE_RANGE',
  UE_DIAGNOSES = 'UE_DIAGNOSES',
  UE_RADIO_BOOLEAN = 'UE_RADIO_BOOLEAN',
  UE_SICK_LEAVE_PERIOD = 'UE_SICK_LEAVE_PERIOD',
  UE_TEXTAREA = 'UE_TEXTAREA',
}

export interface CertificateDataConfig {
  header?: string
  icon?: string
  text: string
  description: string
  type: ConfigTypes
}

export interface Category extends CertificateDataConfig {}

export interface UeTextArea extends CertificateDataConfig {
  id: string
}

export interface UeRadioBoolean extends CertificateDataConfig {
  id: string
  selectedText: string
  unSelectedText: string
}

export interface UeCheckboxBoolean extends CertificateDataConfig {
  id: string
  label: string
}

export interface UeCheckboxMultipleCodes extends CertificateDataConfig {
  list: UeCheckboxBoolean[]
}

export interface UeCheckboxDate extends CertificateDataConfig {
  id: string
  label: string
}

export interface UeCheckboxDateRange extends CertificateDataConfig {
  id: string
  label: string
}

export interface UeCheckboxMultipleDate extends CertificateDataConfig {
  list: UeCheckboxDate[]
}

export interface UeSickLeavePeriod extends CertificateDataConfig {
  list: UeCheckboxDateRange[]
}

export interface UeDiagnoses extends CertificateDataConfig {
  terminology: string[]
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
  TEXT = 'TEXT',
  UNKNOWN = 'UNKNOWN',
}

export interface Value {
  type: CertificateDataValueType
}

export interface ValueBoolean extends Value {
  id: string
  selected: boolean | null
}

export interface ValueCode extends Value {
  id: string
  code: string
}

export interface ValueDate extends Value {
  id: string
  date: string
}

export interface ValueDateList extends Value {
  list: ValueDate
}

export interface ValueDateRange extends Value {
  id: string
  from: string
  to: string
}

export interface ValueDateRangeList extends Value {
  list: ValueDateRange
}

export interface ValueDiagnosis extends Value {
  id: string
  terminology: string
  code: string
  description: string
}

export interface ValueDiagnosisList extends Value {
  list: ValueDiagnosis[]
}

export interface ValueCodeList extends Value {
  list: ValueCode[]
}

export interface ValueText extends Value {
  id: string
  text: string
}

// Validation

export enum CertificateDataValidationType {
  TEXT_VALIDATION = 'TEXT_VALIDATION',
  SHOW_VALIDATION = 'SHOW_VALIDATION',
  HIDE_VALIDATION = 'HIDE_VALIDATION',
  DISABLE_VALIDATION = 'DISABLE_VALIDATION',
  MANDATORY_VALIDATION = 'MANDATORY_VALIDATION',
  MAX_DATE_VALIDATION = 'MAX_DATE_VALIDATION',
  DEFAULT_DATE_VALIDATION = 'DEFAULT_DATE_VALIDATION',
}

export interface CertificateDataValidation {
  type: CertificateDataValidationType
}

export interface TextValidation extends CertificateDataValidation {
  id: string
  limit: number
  // expression: string // '$6.1 > 5000' // Kan allt beskrivas med expression?
}

export interface ShowValidation extends CertificateDataValidation {
  questionId: string
  // id: string
  expression: string // '1.1 === true' // '($27.2 || $27.3 || $27.4) && !$27.1' // Undersök möjligheten att beskriva det här i ett expression objekt
}

export interface HideValidation extends CertificateDataValidation {
  questionId: string
  expression: string
}

export interface DisableValidation extends CertificateDataValidation {
  questionId: string // '7.1'
  expression: string // '7.1.1 === KV_FKMU_0004.EJ_AKTUELLT'
  id: string[] // 'KV_FKMU_0004.ARBETSTRANING, KV_FKMU_0004.ERGONOMISK,'
}

export interface MandatoryValidation extends CertificateDataValidation {
  questionId: string
  expression: string
}

// How to handle date ranges i.e. min & max
export interface MaxDateValidation extends CertificateDataValidation {
  id: string
  numberOfDays: number
}

// --------------------------------------------

export interface CheckBoxMetadata extends CertificateBooleanValue {
  text?: string
  disableAll?: boolean
  disabled?: boolean
}

export interface CertificateDataValidation {
  required: boolean
  requiredProp: string
  hideExpression: string
}

export interface ValidationError {
  id: string
  category: string
  field: string
  type: string
  text: string
}

export interface Unit {
  unitId: string
  unitName: string
  address: string
  zipCode: string
  city: string
  phoneNumber: string
  email: string
}

export interface Patient {
  personId: string
  firstName: string
  lastName: string
  fullName: string
  coordinationNumber: boolean
  testIndicated: boolean
  protectedPerson: boolean
  deceased: boolean
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
  REPLACE = 'REPLACE',
  COPIED = 'COPIED',
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
  INCOMING_MESSAGE_REMINDER = 'INCOMING_MESSAGE_REMINDER',
  REQUEST_FOR_COMPLEMENT = 'REQUEST_FOR_COMPLEMENT',
  REVOKED = 'REVOKED',
  REPLACED = 'REPLACED',
  REPLACES = 'REPLACES',
  COMPLEMENTED = 'COMPLEMENTED',
  EXTENDED = 'EXTENDED',
  CREATED_FROM = 'CREATED_FROM',
  COPIED_BY = 'COPIED_BY',
  COPIED_FROM = 'COPIED_FROM',
  RELATED_CERTIFICATE_REVOKED = 'RELATED_CERTIFICATE_REVOKED',
}
