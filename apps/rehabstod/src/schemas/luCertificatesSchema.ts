import { z } from 'zod'
import { diagnosKapitelSchema, diagnosisSchema } from './diagnosisSchema'
import { lakareSchema } from './lakareSchema'
import { patientInfoSchema } from './patientSchema'

export const luCertificatesFilterSchema = z.object({
  certTypes: z.array(z.string()),
  diagnoses: z.array(z.string()),
  doctors: z.array(z.string()),
  fromDate: z.nullable(z.string()),
  toDate: z.nullable(z.string()),
  questionAndAnswers: z.nullable(z.number()),
  searchText: z.string(),
  fromAge: z.number(),
  toAge: z.number(),
})

export const luCertificateSchema = z.object({
  biDiagnoses: z.array(diagnosisSchema),
  careProviderId: z.string(),
  careProviderName: z.string(),
  careUnitId: z.string(),
  careUnitName: z.string(),
  certificateId: z.string(),
  certificateType: z.string(),
  diagnosis: z.optional(diagnosisSchema),
  doctor: lakareSchema,
  patient: patientInfoSchema,
  signingTimeStamp: z.string(),
  unAnsweredComplement: z.number(),
  unAnsweredOther: z.number(),
  encryptedPatientId: z.string(),
})

export const luCertificatesInfoSchema = z.object({
  certificates: z.array(luCertificateSchema),
  questionAndAnswersError: z.boolean(),
})

export const luCertificateFilterOptions = z.object({
  doctors: z.array(lakareSchema),
  allDiagnosisChapters: z.array(diagnosKapitelSchema),
})

export type LUCertificatesFilter = z.infer<typeof luCertificatesFilterSchema>
export type LUCertificatesFilterOptions = z.infer<typeof luCertificateFilterOptions>
export type LUCertificate = z.infer<typeof luCertificateSchema>
export type LUCertificatesInfo = z.infer<typeof luCertificatesInfoSchema>
