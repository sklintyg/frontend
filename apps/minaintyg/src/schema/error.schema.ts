import { z } from 'zod'

export const ErrorType = z.enum(['unknown', 'login-failed', 'unavailable', 'logged-out', 'not-found', 'underage'])
export type ErrorTypeEnum = z.infer<typeof ErrorType>

export const ErrorPageActionType = z.enum(['start', 'login', '1177', 'about'])
export type ErrorPageActionTypeEnum = z.infer<typeof ErrorPageActionType>

export const ErrorCode = z.enum([
  'CLIENT_ERROR',
  'LOGIN_FAILED',
  'UNKNOWN_INTERNAL_ERROR',
  'FETCH_ERROR',
  'PARSING_ERROR',
  'TIMEOUT_ERROR',
  'CUSTOM_ERROR',
])

export type ErrorCodeEnum = z.infer<typeof ErrorCode>

export const errorSchema = z.object({
  id: z.string(),
  code: ErrorCode.or(z.number()),
  message: z.string(),
  stackTrace: z.string().nullable().optional(),
})

export type ErrorData = z.infer<typeof errorSchema>
