import { z } from 'zod'

export const userSchema = z.object({
  personId: z.string(),
  personName: z.string(),
  loginMethod: z.string(),
})

export type User = z.infer<typeof userSchema>
