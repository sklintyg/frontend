import { z } from 'zod'

const sessionSchema = z.object({
  hasSession: z.boolean(),
  secondsUntilExpire: z.number(),
})

export type Session = z.infer<typeof sessionSchema>
