import { z } from 'zod'
import { diagnosisSchema } from './diagnosisSchema'
import { lakareSchema } from './lakareSchema'
import { patientInfoSchema } from './patientSchema'

export const agCertificateSchema = z.object({
  biDiagnoses: z.array(diagnosisSchema),
  careProviderId: z.string(),
  careProviderName: z.string(),
  careUnitId: z.string(),
  careUnitName: z.string(),
  certificateId: z.string(),
  certificateType: z.string(),
  diagnosis: diagnosisSchema,
  doctor: lakareSchema,
  patient: patientInfoSchema,
  signingTimeStamp: z.string(),
  start: z.string(),
  end: z.string(),
  days: z.number(),
  degree: z.array(z.number()),
  occupation: z.array(z.string()),
  unAnsweredComplement: z.number(),
  unAnsweredOther: z.number(),
  encryptedPatientId: z.string(),
})

export const agCertificatesInfoSchema = z.object({
  certificates: z.array(agCertificateSchema),
  questionAndAnswersError: z.boolean(),
})

export type AGCertificate = z.infer<typeof agCertificateSchema>
export type AGCertificatesInfo = z.infer<typeof agCertificatesInfoSchema>
