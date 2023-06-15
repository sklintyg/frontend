import { z } from 'zod'

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

export type LUCertificatesFilter = z.infer<typeof luCertificatesFilterSchema>
