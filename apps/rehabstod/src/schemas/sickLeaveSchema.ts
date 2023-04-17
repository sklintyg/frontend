// Generated by ts-to-zod
import { z } from 'zod'

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

export enum Gender {
  M = 'M',
  F = 'F',
}

export enum PuResponse {
  FOUND = 'FOUND',
  NOT_FOUND = 'NOT_FOUND',
  MISSING = 'MISSING',
}

export const sickLeaveColumnSchema = z.nativeEnum(SickLeaveColumn)

export const sickLeaveDiagnosisSchema = z.object({
  beskrivning: z.string(),
  intygsVarde: z.string(),
  kapitel: z.string(),
  kod: z.string(),
  namn: z.string(),
})

export const lakareSchema = z.object({
  namn: z.string(),
  hsaId: z.string(),
})

export const riskSignalSchema = z.object({
  berakningsTidpunkt: z.string(),
  intygsId: z.string(),
  riskDescription: z.string(),
  riskKategori: z.number(),
})

export const genderSchema = z.nativeEnum(Gender)

export const puResponseSchema = z.nativeEnum(PuResponse)

export const patientInfoSchema = z.object({
  alder: z.number(),
  id: z.string(),
  kon: genderSchema,
  namn: z.string(),
  responseFromPu: puResponseSchema,
  riskSignal: riskSignalSchema,
})

export const sickLeaveInfoSchema = z.object({
  aktivGrad: z.number(),
  biDiagnoser: z.array(sickLeaveDiagnosisSchema),
  dagar: z.number(),
  diagnos: sickLeaveDiagnosisSchema,
  grader: z.array(z.number()),
  intyg: z.number(),
  lakare: lakareSchema,
  nyligenAvslutat: z.boolean(),
  obesvaradeKompl: z.number(),
  patient: patientInfoSchema,
  riskSignal: riskSignalSchema,
  slut: z.string(),
  slutOmDagar: z.string(),
  start: z.string(),
  unansweredOther: z.number(),
  vardEnhetId: z.string(),
  vardEnhetNamn: z.string(),
  vardGivareId: z.string(),
  vardGivareNamn: z.string(),
})

export const diagnosKategoriSchema = z.object({
  letter: z.string(),
  number: z.number(),
})

export const diagnosKapitelSchema = z.object({
  to: diagnosKategoriSchema,
  from: diagnosKategoriSchema,
  name: z.string(),
  id: z.string(),
})

export const sickLeaveFilterSchema = z.object({
  doctorIds: z.array(z.string()),
  toSickLeaveLength: z.number(),
  fromSickLeaveLength: z.number(),
  diagnosisChapters: z.array(diagnosKapitelSchema),
})

export const genderSummarySchema = z.object({
  count: z.number(),
  gender: z.string(),
  percentage: z.number(),
})

export const sickLeaveDegreeSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  count: z.number(),
  percentage: z.number(),
})

export const sickLeaveSummary = z.object({
  total: z.number(),
  genders: z.array(genderSummarySchema),
  sickLeaveDegrees: z.array(sickLeaveDegreeSummarySchema),
  maleSickLeaveDegrees: z.array(sickLeaveDegreeSummarySchema),
  femaleSickLeaveDegrees: z.array(sickLeaveDegreeSummarySchema),
})

export type DiagnosKapitel = z.infer<typeof diagnosKapitelSchema>
export type DiagnosKategori = z.infer<typeof diagnosKategoriSchema>
export type Lakare = z.infer<typeof lakareSchema>
export type PatientInfo = z.infer<typeof patientInfoSchema>
export type RiskSignal = z.infer<typeof riskSignalSchema>
export type SickLeaveDiagnosis = z.infer<typeof sickLeaveDiagnosisSchema>
export type SickLeaveFilter = z.infer<typeof sickLeaveFilterSchema>
export type SickLeaveInfo = z.infer<typeof sickLeaveInfoSchema>
export type SickLeaveSummary = z.infer<typeof sickLeaveSummary>
export type GenderSummary = z.infer<typeof genderSummarySchema>
export type SickLeaveDegreeSummary = z.infer<typeof sickLeaveDegreeSummarySchema>
