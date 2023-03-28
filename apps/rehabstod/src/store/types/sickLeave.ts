export interface SickLeaveInfo {
  aktivGrad: number
  biDiagnoser: SickLeaveDiagnosis[]
  dagar: number
  diagnos: SickLeaveDiagnosis
  grader: number[]
  intyg: number
  lakare: UserInfo
  nyligenAvslutat: boolean
  obesvaradeKompl: number
  patient: PatientInfo
  riskSignal: RiskSignal
  slut: string
  slutOmDagar: string
  start: string
  unansweredOther: number
  vardEnhetId: string
  vardEnhetNamn: string
  vardGivareId: string
  vardGivareNamn: string
}

export interface ActiveSickLeavesResponse {
  content: SickLeaveInfo[]
}

export interface SickLeaveDiagnosis {
  beskrivning: string
  intygsVarde: string
  kapitel: string
  kod: string
  namn: string
}

export interface UserInfo {
  namn: string
  hsaId: string
}

export interface PatientInfo {
  alder: number
  id: string
  kon: Gender
  namn: string
  responseFromPu: PuResponse
  riskSignal: RiskSignal
}

export enum Gender {
  M = 'M',
  F = 'F',
}

export enum PuResponse {
  FOUND = 'FOUND',
  NOT_FOUND = 'NOT_FOUND',
  MISSING = 'MISSING',
}

export interface RiskSignal {
  berakningsTidpunkt: string
  intygsId: string
  riskDescription: string
  riskKategori: number
}
