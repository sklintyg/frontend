import { z } from 'zod'

export const riskSignalSchema = z.object({
  intygsId: z.string(),
  riskKategori: z.number(),
  riskDescription: z.string(),
  berakningstidpunkt: z.string(),
})

export const diagnosSchema = z.object({
  intygsVarde: z.string(),
  kod: z.string(),
  namn: z.null(),
  beskrivning: z.string(),
  kapitel: z.string(),
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
  diagnos: diagnosSchema,
  bidiagnoser: z.array(z.unknown()),
  start: z.string(),
  slut: z.string(),
  signeringsTidpunkt: z.string(),
  dagar: z.number(),
  grader: z.array(z.number()),
  lakare: z.object({ hsaId: z.string(), namn: z.string() }),
  sysselsattning: z.array(z.string()),
  aktivtIntyg: z.boolean(),
  intygsId: z.string(),
  obesvaradeKompl: z.number(),
  unansweredOther: z.number(),
  riskSignal: riskSignalSchema,
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

const sjfMetaDataSchema = z.object({
  vardenheterInomVGMedSparr: z.array(z.unknown()),
  andraVardgivareMedSparr: z.array(z.unknown()),
  kraverSamtycke: z.array(
    z.object({
      itemType: z.string(),
      itemId: z.string(),
      itemName: z.string(),
      includedInSjukfall: z.boolean(),
      bidrarTillAktivtSjukfall: z.boolean(),
    })
  ),
  kraverInteSamtycke: z.array(z.unknown()),
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

export type PatientSjukfallIntyg = z.infer<typeof patientSjukfallIntygSchema>
export type PatientSjukfall = z.infer<typeof patientSjukfallSchema>
export type Patient = z.infer<typeof patientSchema>
