import { z } from 'zod'

export const CertificateStatusEnum = z.enum(['NEW', 'REPLACED', 'SENT', 'NOT_SENT'])

export const certificateEventSchema = z.object({
  timestamp: z.string().datetime(),
  certificateId: z.string(),
  description: z.string(),
})

export const certificateTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
})

export const certificateIssuerSchema = z.object({ name: z.string() })

export const certificateUnitSchema = z.object({ id: z.string(), name: z.string() })

export const certificateMetadataSchema = z.object({
  issuer: certificateIssuerSchema,
  unit: certificateUnitSchema,
  events: z.array(certificateEventSchema),
  statuses: z.array(CertificateStatusEnum),
  id: z.string(),
  issued: z.string().datetime(),
  type: certificateTypeSchema,
})

export const certificateSchema = z.object({
  metadata: certificateMetadataSchema,
  content: z.string(),
})

export type CertificateEvent = z.infer<typeof certificateEventSchema>
export type CertificateIssuer = z.infer<typeof certificateIssuerSchema>
export type CertificateMetadata = z.infer<typeof certificateMetadataSchema>
export type CertificateUnit = z.infer<typeof certificateUnitSchema>
export type CertificateStatus = z.infer<typeof CertificateStatusEnum>
export type Certificate = z.infer<typeof certificateSchema>
