export interface Certificate {
  metadata: CertificateMetadata
  data: CertificateData
}

export enum CertificateStatus {
  UNSIGNED = 'UNSIGNED',
  SIGNED = 'SIGNED',
  INVALIDATED = 'INVALIDATED',
}

export interface CertificateMetadata {
  certificateId: string
  certificateName: string
  certificateDescription: string
  certificateType: string
  certificateTypeVersion: string
  certificateStatus: CertificateStatus
  testCertificate: boolean
  relations: CertificateRelations
  unit: Unit
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
  selectedText: string
  unselectedText: string
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
}
