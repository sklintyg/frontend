import { z } from 'zod'

export const linkSchema = z.object({
  key: z.string(),
  url: z.string(),
  text: z.string(),
  tooltip: z.string().nullable(),
  target: z.string().optional(),
})

export type Link = z.infer<typeof linkSchema>
