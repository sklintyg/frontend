import { z } from 'zod'

export const userSchema = z.object({
  personId: z.string(),
  fullName: z.string(),
  loginMethod: z.string(),
  sekretessmarkering: z.boolean(),
})

export type User = z.infer<typeof userSchema>
