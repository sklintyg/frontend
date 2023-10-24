import { z } from 'zod'

export const CertificateStatusEnum = z.enum(['NEW', 'REPLACED', 'SENT', 'NOT_SENT'])

export const certificateEventSchema = z.object({
  timestamp: z.string().datetime(),
  certificateId: z.string().nullable(),
  description: z.string(),
})

export const certificateSummarySchema = z.object({ label: z.string(), value: z.string() }).optional()

export const certificateTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
})

export const certificateIssuerSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
})

export const certificateUnitSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
})

export const certificateRecipientSchema = z.object({
  id: z.string(),
  name: z.string(),
  sent: z.string().nullable(),
})

export const certificateMetadataSchema = z.object({
  issuer: certificateIssuerSchema,
  unit: certificateUnitSchema,
  events: z.array(certificateEventSchema),
  statuses: z.array(CertificateStatusEnum),
  id: z.string(),
  issued: z.string().datetime(),
  recipient: certificateRecipientSchema.nullable(),
  type: certificateTypeSchema,
  summary: certificateSummarySchema,
})

export const certificateContentSchema = z.object({ heading: z.string(), body: z.string() })

export const certificateSchema = z.object({
  metadata: certificateMetadataSchema,
  content: z.array(certificateContentSchema),
})

export type Certificate = z.infer<typeof certificateSchema>
export type CertificateContent = z.infer<typeof certificateContentSchema>
export type CertificateEvent = z.infer<typeof certificateEventSchema>
export type CertificateIssuer = z.infer<typeof certificateIssuerSchema>
export type CertificateMetadata = z.infer<typeof certificateMetadataSchema>
export type CertificateRecipient = z.infer<typeof certificateRecipientSchema>
export type CertificateStatus = z.infer<typeof CertificateStatusEnum>
export type CertificateSummary = z.infer<typeof certificateSummarySchema>
export type CertificateUnit = z.infer<typeof certificateUnitSchema>
