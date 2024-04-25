import { Unit } from './certificate'

export interface User {
  hsaId: string
  name: string
  role: string
  loggedInUnit: Unit
  loggedInCareUnit: Unit
  loggedInCareProvider: Unit
  preferences: Record<string, string> | null
  signingMethod: SigningMethod
  loginMethod: LoginMethod
  protectedPerson: boolean
  careProviders: CareProvider[]
  launchId?: string
  launchFromOrigin?: string
}

export enum SigningMethod {
  BANK_ID = 'BANK_ID',
  DSS = 'DSS',
  FAKE = 'FAKE',
}

export enum LoginMethod {
  BANK_ID = 'BANK_ID',
  BANK_ID_MOBILE = 'BANK_ID_MOBILE',
  FAKE = 'FAKE',
  SITHS = 'SITHS',
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
  nbrOfUnhandledQuestionsOnSelectedUnit: number
  totalDraftsAndUnhandledQuestionsOnOtherUnits: number
  unitStatistics: UnitStatistics
}

export type UnitStatistics = Record<string, UnitStatistic>

export interface UnitStatistic {
  draftsOnUnit: number
  questionsOnUnit: number
  draftsOnSubUnits: number
  questionsOnSubUnits: number
}

export interface CareProvider {
  id: string
  name: string
  missingSubscription: boolean
  careUnits: CareUnit[]
}

export interface CareUnit extends Unit {
  units: Unit[]
}
