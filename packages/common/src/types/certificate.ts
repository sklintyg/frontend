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

export interface CertificateDataConfig {
  text: string
  description: string
  component: string
  prop: string
}

export enum CertificateDataValueType {
  BOOLEAN = 'BOOLEAN',
  TEXT = 'TEXT',
  UNKNOWN = 'UNKNOWN',
}

export interface CertificateDataValue {
  type: CertificateDataValueType
}

export interface CertificateBooleanValue extends CertificateDataValue {
  selected: boolean | null
  selectedText?: string
  unselectedText?: string
  text?: string
}

export interface CertificateTextValue extends CertificateDataValue {
  text: string
  limit: number
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
