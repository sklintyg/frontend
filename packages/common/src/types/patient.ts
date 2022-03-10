export enum PatientStatus {
  FOUND = 'FOUND',
  NOT_FOUND = 'NOT_FOUND',
  ERROR = 'ERROR',
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
}

export interface PersonId {
  type: string
  id: string
}
