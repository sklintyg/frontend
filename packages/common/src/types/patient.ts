import { ResourceLink } from './resourceLink'

export enum PatientStatus {
  FOUND = 'FOUND',
  NOT_FOUND = 'NOT_FOUND',
  ERROR = 'ERROR',
  INVALID_PATIENT_ID = 'INVALID_PATIENT_ID',
  NO_NAME = 'NO_NAME',
}

export interface Patient {
  personId: PersonId
  previousPersonId?: PersonId
  firstName: string
  lastName: string
  fullName: string
  coordinationNumber: boolean
  testIndicated: boolean
  protectedPerson: boolean
  deceased: boolean
  differentNameFromEHR: boolean
  personIdUpdated: boolean
  personIdChanged: boolean
  reserveId: boolean
}

export interface PersonId {
  type: string
  id: string
}

export interface CertificateType {
  description: string
  detailedDescription: string
  id: string
  issuerTypeId: string
  label: string
  links: ResourceLink[]
}
