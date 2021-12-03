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
  protectedPerson: boolean
}

export enum SigningMethod {
  DSS = 'DSS',
  FAKE = 'FAKE',
}

export interface UserProperty {
  key: string
  value: string
}

export interface FakeLogin {
  hsaId: string
}
