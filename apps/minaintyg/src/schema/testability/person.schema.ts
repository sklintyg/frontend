import { z } from 'zod'

export const testabilityPersonSchema = z.object({
  personId: z.string(),
  personName: z.string(),
})

export type TestabilityPerson = z.infer<typeof testabilityPersonSchema>
