import { z } from 'zod'

export const certificateDescriptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  detailedDescription: z.string(),
  issuerTypeId: z.string(),
  cssPath: z.string(),
  scriptPath: z.string(),
  dependencyDefinitionPath: z.string(),
  defaultRecipient: z.string(),
  deprecated: z.boolean(),
  displayDeprecated: z.boolean(),
})

export type CertificateDescription = z.infer<typeof certificateDescriptionSchema>
