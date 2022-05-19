import { Unit } from './certificate'

export interface User {
  hsaId: string
  name: string
  role: string
  loggedInUnit: Unit
  loggedInCareUnit: Unit
  loggedInCareProvider: Unit
  preferences: { [key: string]: string } | null
  signingMethod: SigningMethod
  loginMethod: LoginMethod
  protectedPerson: boolean
  careProviders: CareProvider[]
}

export enum SigningMethod {
  DSS = 'DSS',
  FAKE = 'FAKE',
}

export enum LoginMethod {
  BANK_ID = 'BANK_ID',
  SITHS = 'SITHS',
  FAKE = 'FAKE',
}

export interface UserProperty {
  key: string
  value: string
}

export interface FakeLogin {
  unitId: string
}

export interface UserStatistics {
  nbrOfDraftsOnSelectedUnit: number
}

export interface CareProvider {
  id: string
  name: string
  careUnits: CareUnit[]
}

export interface CareUnit extends Unit {
  units: Unit[]
}
