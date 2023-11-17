import { z } from 'zod'

export const sessionSchema = z.object({
  hasSession: z.boolean(),
  secondsUntilExpire: z.number(),
})

export type Session = z.infer<typeof sessionSchema>
