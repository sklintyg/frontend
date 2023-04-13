import { z } from 'zod'

export const lakareSchema = z.object({
  namn: z.string(),
  hsaId: z.string(),
})

export type Lakare = z.infer<typeof lakareSchema>
