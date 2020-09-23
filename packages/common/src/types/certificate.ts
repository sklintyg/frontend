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
  certificateCode: string
  certificateId: string
  certificateName: string
  status: CertificateStatus
  unit: Unit
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
  selected: boolean
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
  [postalAddress: string]: {
    value: string,
    displayText: string
  }
  zipCode: {
    value: string,
    displayText: string
  }
  city: {
    value: string,
    displayText: string
  }
  phoneNumber: {
    value: string,
    displayText: string
  }
}