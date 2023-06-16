import { z } from 'zod'
import { diagnosisSchema } from './diagnosisSchema'
import { lakareSchema } from './lakareSchema'
import { patientInfoSchema } from './sickLeaveSchema'

export const luCertificatesFilterSchema = z.object({
  certTypes: z.array(z.string()),
  diagnoses: z.array(z.string()),
  doctors: z.array(z.string()),
  fromDate: z.nullable(z.string()),
  toDate: z.nullable(z.string()),
  questionAndAnswers: z.number(),
  searchText: z.string(),
  fromAge: z.number(),
  toAge: z.number(),
})

export const luCertificateSchema = z.object({
  biDiagnoses: z.array(z.string()),
  careProviderId: z.string(),
  careProviderName: z.string(),
  careUnitId: z.string(),
  careUnitName: z.string(),
  certificateId: z.string(),
  certificateType: z.string(),
  diagnosis: z.object(diagnosisSchema),
  doctor: z.object(lakareSchema),
  patient: z.object(patientInfoSchema),
  signingTimeStamp: z.string(),
  unAnsweredComplement: z.number(),
  unAnsweredOther: z.number(),
})

export const luCertificatesInfo = z.object({
  certificates: z.array(z.object(luCertificateSchema)),
  questionAndAnswersError: z.boolean(),
})

export type LUCertificatesFilter = z.infer<typeof luCertificatesFilterSchema>
export type LUCertificate = z.infer<typeof luCertificateSchema>
export type LUCertificatesInfo = z.infer<typeof luCertificatesInfo>
