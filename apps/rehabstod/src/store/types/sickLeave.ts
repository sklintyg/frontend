export enum SickLeaveColumn {
  Personnummer = 'personnummer',
  Ålder = 'ålder',
  Namn = 'namn',
  Kön = 'kön',
  Diagnos = 'diagnos/er',
  Startdatum = 'startdatum',
  Slutdatum = 'slutdatum',
  Längd = 'längd',
  Intyg = 'intyg',
  Grad = 'grad',
  Läkare = 'läkare',
}

export interface SickLeaveInfo {
  aktivGrad: number
  biDiagnoser: SickLeaveDiagnosis[]
  dagar: number
  diagnos: SickLeaveDiagnosis
  grader: number[]
  intyg: number
  lakare: Lakare
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

export interface SickLeaveDiagnosis {
  beskrivning: string
  intygsVarde: string
  kapitel: string
  kod: string
  namn: string
}

export interface Lakare {
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

export interface DiagnosKategori {
  letter: string
  number: number
}

export interface DiagnosKapitel {
  to: DiagnosKategori
  from: DiagnosKategori
  name: string
  id: string
}

export interface ActiveSickLeavesRequest {
  doctorIds: string[]
  diagnoses: DiagnosKapitel[]
  toSickLeaveLength: number
  fromSickLeaveLength: number
}

export interface PopulateFiltersResponse {
  activeDoctors: Lakare[]
  allDiagnosisChapters: DiagnosKapitel[]
  enabledDiagnosisChapters: DiagnosKapitel[]
}
