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
  careProvider: CareProvider | undefined
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
  hsaId: string
}

export interface UserStatistics {
  nbrOfDraftsOnSelectedUnit: number
}

export interface CareProvider {
  hsaId: string
  name: string
  careUnit: CareUnit
}

export interface CareUnit {
  hsaId: string
  name: string
  unit: Unit
}
