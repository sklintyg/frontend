import { z } from 'zod'

export enum CertificateStatus {
  NEW = 'Nytt',
  REPLACE = 'Ersätter intyg',
  SENT = 'Skickat',
  NOT_SENT = 'Ej skickat',
}

export const certificateListSummarySchema = z.array(z.tuple([z.string(), z.string()]))

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
  title: z.string(),
  summary: certificateListSummarySchema,
  issuer: certificateListIssuerSchema,
  unit: certificateUnitSchema,
  events: z.array(certificateListEventSchema),
  statuses: z.array(z.nativeEnum(CertificateStatus)),
  certificateId: z.string(),
  timestamp: z.string().datetime(),
  type: certificateTypeSchema,
})

export type CertificateListEvent = z.infer<typeof certificateListEventSchema>
export type CertificateListIssuer = z.infer<typeof certificateListIssuerSchema>
export type CertificateListUnit = z.infer<typeof certificateUnitSchema>
export type CertificateListSummary = z.infer<typeof certificateListSummarySchema>
export type CertificateListItem = z.infer<typeof certificateListItemSchema>
