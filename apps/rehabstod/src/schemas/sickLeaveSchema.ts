// Generated by ts-to-zod
import { z } from 'zod'
import { lakareSchema } from './lakareSchema'

export enum Gender {
  M = 'M',
  F = 'F',
}

export enum PuResponse {
  FOUND = 'FOUND',
  NOT_FOUND = 'NOT_FOUND',
  MISSING = 'MISSING',
}

export const sickLeaveDiagnosisSchema = z.object({
  beskrivning: z.string(),
  intygsVarde: z.string(),
  kapitel: z.string(),
  kod: z.string(),
  namn: z.string(),
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
  sysselsattning: z.array(z.string()),
  encryptedPatientId: z.string(),
  rekoStatus: z.string(),
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

export const sickLeaveLengthIntervalSchema = z.object({
  to: z.nullable(z.number()),
  from: z.nullable(z.number()),
})

export const sickLeaveFilterSchema = z.object({
  doctorIds: z.array(z.string()),
  sickLeaveLengthIntervals: z.array(sickLeaveLengthIntervalSchema),
  diagnosisChapters: z.array(diagnosKapitelSchema),
  fromPatientAge: z.number(),
  toPatientAge: z.number(),
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

export const sickLeaveLengthSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  count: z.number(),
  percentage: z.number(),
})

export const diagnosGruppSchema = z.object({
  id: z.string(),
  name: z.string(),
  kapitelList: z.array(diagnosKapitelSchema),
})

export const diagnosGruppStatSchema = z.object({
  grupp: diagnosGruppSchema,
  count: z.number(),
  percentage: z.number(),
})

export const sickLeaveSummary = z.object({
  total: z.number(),
  genders: z.array(genderSummarySchema),
  groups: z.array(diagnosGruppStatSchema),
  maleDiagnosisGroups: z.array(diagnosGruppStatSchema),
  femaleDiagnosisGroups: z.array(diagnosGruppStatSchema),
  sickLeaveDegrees: z.array(sickLeaveDegreeSummarySchema),
  maleSickLeaveDegrees: z.array(sickLeaveDegreeSummarySchema),
  femaleSickLeaveDegrees: z.array(sickLeaveDegreeSummarySchema),
  countSickLeaveDegrees: z.array(sickLeaveDegreeSummarySchema),
  countMaleSickLeaveDegrees: z.array(sickLeaveDegreeSummarySchema),
  countFemaleSickLeaveDegrees: z.array(sickLeaveDegreeSummarySchema),
  sickLeaveLengths: z.array(sickLeaveLengthSummarySchema),
  maleSickLeaveLengths: z.array(sickLeaveLengthSummarySchema),
  femaleSickLeaveLengths: z.array(sickLeaveLengthSummarySchema),
})

export const summaryDataPointSchema = z.object({
  id: z.string(),
  value: z.number(),
  fill: z.string(),
  name: z.string(),
  description: z.optional(z.string()),
})

export const rekoStatus = z.object({
  id: z.string(),
  name: z.string(),
})

export type DiagnosKapitel = z.infer<typeof diagnosKapitelSchema>
export type DiagnosKategori = z.infer<typeof diagnosKategoriSchema>
export type PatientInfo = z.infer<typeof patientInfoSchema>
export type RiskSignal = z.infer<typeof riskSignalSchema>
export type SickLeaveDiagnosis = z.infer<typeof sickLeaveDiagnosisSchema>
export type SickLeaveFilter = z.infer<typeof sickLeaveFilterSchema>
export type SickLeaveInfo = z.infer<typeof sickLeaveInfoSchema>
export type SickLeaveSummary = z.infer<typeof sickLeaveSummary>
export type GenderSummary = z.infer<typeof genderSummarySchema>
export type SickLeaveDegreeSummary = z.infer<typeof sickLeaveDegreeSummarySchema>
export type SickLeaveLengthSummary = z.infer<typeof sickLeaveLengthSummarySchema>
export type DiagnosGrupp = z.infer<typeof diagnosGruppSchema>
export type DiagnosGruppStat = z.infer<typeof diagnosGruppStatSchema>
export type SummaryDataPoint = z.infer<typeof summaryDataPointSchema>
export type SickLeaveLengthInterval = z.infer<typeof sickLeaveLengthIntervalSchema>
export type RekoStatus = z.infer<typeof rekoStatus>
