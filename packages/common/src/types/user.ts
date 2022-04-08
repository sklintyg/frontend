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

export interface CertificateType {
  description: string
  detailedDescription: string
  id: string
  issuerTypeId: string
  label: string
  links: CertificateTypeLink[]
}

export interface CertificateTypeLink {
  type: string
}