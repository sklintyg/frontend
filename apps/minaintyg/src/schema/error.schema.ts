import { z } from 'zod'

export const ErrorType = z.enum(['unknown', 'login-failed', 'unavailable', 'logged-out', 'not-found'])
export type ErrorTypeEnum = z.infer<typeof ErrorType>
