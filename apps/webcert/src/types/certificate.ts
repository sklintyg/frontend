import type { CertificateDataConfigType } from './certificateDataConfig'
import type { ValueType } from './certificateDataValue'
import type { CertificateDataValidation } from './certificateValidation'
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
