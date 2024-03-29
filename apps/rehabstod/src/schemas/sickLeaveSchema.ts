// Generated by ts-to-zod
import { z } from 'zod'
import { diagnosGruppStatSchema, diagnosisSchema, diagnosKapitelSchema } from './diagnosisSchema'
import { lakareSchema } from './lakareSchema'
import { patientInfoSchema } from './patientSchema'

export const riskSignalSchema = z.object({
  berakningsTidpunkt: z.string(),
  intygsId: z.string(),
  riskDescription: z.string(),
  riskKategori: z.nullable(z.number()),
})

export const unansweredCommunicationFilterType = z.object({
  id: z.string(),
  name: z.string(),
})

export const rekoStatusType = z.object({
  id: z.string(),
  name: z.string(),
})

export const occupationType = z.object({
  id: z.string(),
  name: z.string(),
})

export const rekoStatus = z.object({
  status: rekoStatusType,
})

export const sickLeaveInfoSchema = z.object({
  aktivGrad: z.number(),
  biDiagnoser: z.array(diagnosisSchema),
  dagar: z.number(),
  diagnos: z.optional(diagnosisSchema),
  grader: z.array(z.number()),
  intyg: z.number(),
  lakare: lakareSchema,
  nyligenAvslutat: z.boolean(),
  obesvaradeKompl: z.number(),
  patient: patientInfoSchema,
  riskSignal: z.nullable(riskSignalSchema),
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
  rekoStatus,
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
  fromSickLeaveEndDate: z.string().nullable(),
  toSickLeaveEndDate: z.string().nullable(),
  rekoStatusTypeIds: z.array(z.string()),
  occupationTypeIds: z.array(z.string()),
  unansweredCommunicationFilterTypeId: z.string(),
  textSearch: z.string(),
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
  tooltip: z.optional(z.string()),
})

export const sickLeaveFilterOptions = z.object({
  activeDoctors: z.array(lakareSchema),
  allDiagnosisChapters: z.array(diagnosKapitelSchema),
  enabledDiagnosisChapters: z.array(diagnosKapitelSchema),
  nbrOfSickLeaves: z.number(),
  hasOngoingSickLeaves: z.boolean(),
  rekoStatusTypes: z.array(rekoStatusType),
  occupationTypes: z.array(occupationType),
  unansweredCommunicationFilterTypes: z.array(unansweredCommunicationFilterType),
  srsActivated: z.boolean(),
})

export type SickLeaveFilterOptions = z.infer<typeof sickLeaveFilterOptions>
export type SickLeaveFilter = z.infer<typeof sickLeaveFilterSchema>
export type SickLeaveInfo = z.infer<typeof sickLeaveInfoSchema>
export type SickLeaveSummary = z.infer<typeof sickLeaveSummary>
export type GenderSummary = z.infer<typeof genderSummarySchema>
export type SickLeaveDegreeSummary = z.infer<typeof sickLeaveDegreeSummarySchema>
export type SickLeaveLengthSummary = z.infer<typeof sickLeaveLengthSummarySchema>
export type SummaryDataPoint = z.infer<typeof summaryDataPointSchema>
export type SickLeaveLengthInterval = z.infer<typeof sickLeaveLengthIntervalSchema>
export type RekoStatusType = z.infer<typeof rekoStatusType>
export type OccupationType = z.infer<typeof occupationType>
export type UnansweredCommunicationFilterType = z.infer<typeof unansweredCommunicationFilterType>
export type RekoStatus = z.infer<typeof rekoStatus>
export type RiskSignal = z.infer<typeof riskSignalSchema>
