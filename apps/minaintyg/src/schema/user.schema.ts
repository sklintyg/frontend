import { z } from 'zod'

export const loginMethodEnum = z.enum(['FAKE', 'SAML'])

export const userSchema = z.object({
  personId: z.string(),
  personName: z.string(),
  loginMethod: loginMethodEnum,
})

export type User = z.infer<typeof userSchema>
