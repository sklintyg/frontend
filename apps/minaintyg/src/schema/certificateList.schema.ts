import { z } from 'zod'
import { certificateMetadataSchema } from './certificate.schema'

export const certificateSummarySchema = z.object({ label: z.string(), value: z.string() }).optional()

export const certificateListItemSchema = certificateMetadataSchema.and(
  z.object({
    summary: certificateSummarySchema,
  })
)

export type CertificateSummary = z.infer<typeof certificateSummarySchema>
export type CertificateListItem = z.infer<typeof certificateListItemSchema>
