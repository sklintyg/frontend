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
}

export enum SigningMethod {
  DSS = 'DSS',
  FAKE = 'FAKE',
}

export enum LoginMethod {
  NET_ID = 'NET_ID',
  BANK_ID = 'BANK_ID',
  MOBILT_BANK_ID = 'MOBILT_BANK_ID',
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
