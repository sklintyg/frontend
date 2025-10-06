import { z } from 'zod'

const pingSchema = z.object({
  hasSession: z.boolean(),
  secondsUntilExpire: z.number(),
  authenticated: z.boolean(),
})

export type Ping = z.infer<typeof pingSchema>
