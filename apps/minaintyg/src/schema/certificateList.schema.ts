import { z } from 'zod'

export const CertificateStatusEnum = z.enum(['NEW', 'REPLACED', 'SENT', 'NOT_SENT'])

export const certificateListSummarySchema = z.object({ label: z.string(), value: z.string() }).optional()

export const certificateListEventSchema = z.object({
  timestamp: z.string().datetime(),
  certificateId: z.string(),
  description: z.string(),
})

export const certificateListIssuerSchema = z.object({ name: z.string() })
export const certificateUnitSchema = z.object({ id: z.string(), name: z.string() })
export const certificateTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
})

export const certificateListItemSchema = z.object({
  summary: certificateListSummarySchema,
  issuer: certificateListIssuerSchema,
  unit: certificateUnitSchema,
  events: z.array(certificateListEventSchema),
  statuses: z.array(CertificateStatusEnum),
  id: z.string(),
  issued: z.string().datetime(),
  type: certificateTypeSchema,
})

export type CertificateListEvent = z.infer<typeof certificateListEventSchema>
export type CertificateListIssuer = z.infer<typeof certificateListIssuerSchema>
export type CertificateListUnit = z.infer<typeof certificateUnitSchema>
export type CertificateListSummary = z.infer<typeof certificateListSummarySchema>
export type CertificateListItem = z.infer<typeof certificateListItemSchema>
export type CertificateStatus = z.infer<typeof CertificateStatusEnum>
