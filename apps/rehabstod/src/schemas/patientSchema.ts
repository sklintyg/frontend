import { z } from 'zod'
import { diagnosisSchema } from './diagnosisSchema'
import { lakareSchema } from './lakareSchema'

export enum Gender {
  M = 'M',
  F = 'F',
}

const patientRiskSignalSchema = z.object({
  intygsId: z.string(),
  riskKategori: z.number(),
  riskDescription: z.string(),
  berakningsTidpunkt: z.string(),
})

export const patientSjukfallIntygSchema = z.object({
  vardgivareId: z.string(),
  vardgivareNamn: z.string(),
  vardenhetNamn: z.string(),
  vardenhetId: z.string(),
  patient: z.object({
    id: z.string(),
    namn: z.string(),
    kon: z.string(),
    alder: z.number(),
    responseFromPu: z.null(),
  }),
  diagnos: z.optional(diagnosisSchema),
  bidiagnoser: z.array(diagnosisSchema),
  start: z.string(),
  slut: z.string(),
  signeringsTidpunkt: z.string(),
  dagar: z.number(),
  grader: z.array(z.number()),
  lakare: lakareSchema,
  sysselsattning: z.array(z.string()),
  aktivtIntyg: z.boolean(),
  intygsId: z.string(),
  obesvaradeKompl: z.number(),
  unansweredOther: z.number(),
  riskSignal: patientRiskSignalSchema,
  otherVardgivare: z.boolean(),
  otherVardenhet: z.boolean(),
})

export const patientSjukfallSchema = z.object({
  diagnos: z.object({
    intygsVarde: z.string(),
    kod: z.string(),
    namn: z.null(),
    beskrivning: z.string(),
    kapitel: z.string(),
  }),
  start: z.string(),
  slut: z.string(),
  dagar: z.number(),
  intyg: z.array(patientSjukfallIntygSchema),
})

export const sjfItemSchema = z.object({
  bidrarTillAktivtSjukfall: z.boolean(),
  includedInSjukfall: z.boolean(),
  itemId: z.string(),
  itemName: z.string(),
  itemType: z.string(),
})

export const sjfMetaDataSchema = z.object({
  vardenheterInomVGMedSparr: z.array(z.string()),
  andraVardgivareMedSparr: z.array(z.string()),
  kraverSamtycke: z.array(sjfItemSchema),
  kraverInteSamtycke: z.array(sjfItemSchema),
  samtyckeFinns: z.boolean(),
  blockingServiceError: z.boolean(),
  consentServiceError: z.boolean(),
  haveSekretess: z.boolean(),
})

export const patientSchema = z.object({
  sjfMetaData: sjfMetaDataSchema,
  sjukfallList: z.array(patientSjukfallSchema),
  srsError: z.boolean(),
  kompletteringInfoError: z.boolean(),
})

export enum PatientOverviewConsentChoices {
  ONLYCURRENT = 'ONLYCURRENT',
  ALL = 'ALL',
}

export enum PuResponse {
  NOT_FOUND = 'NOT_FOUND',
  FOUND_NO_NAME = 'FOUND_NO_NAME',
}

const puResponseSchema = z.nativeEnum(PuResponse)

const genderSchema = z.nativeEnum(Gender)

export const patientInfoSchema = z.object({
  alder: z.number(),
  id: z.string(),
  kon: genderSchema,
  namn: z.string(),
  responseFromPu: puResponseSchema,
  riskSignal: patientRiskSignalSchema,
})

type PatientRiskSignal = z.infer<typeof patientRiskSignalSchema>
export type PatientSjukfallIntyg = z.infer<typeof patientSjukfallIntygSchema>
export type PatientSjukfall = z.infer<typeof patientSjukfallSchema>
export type Patient = z.infer<typeof patientSchema>
export type SjfMetaData = z.infer<typeof sjfMetaDataSchema>
export type SjfItem = z.infer<typeof sjfItemSchema>
type PatientInfo = z.infer<typeof patientInfoSchema>
