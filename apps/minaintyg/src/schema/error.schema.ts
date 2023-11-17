import { z } from 'zod'

export const ErrorType = z.enum(['unknown', 'login-failed', 'unavailable', 'logged-out', 'not-found'])
export type ErrorTypeEnum = z.infer<typeof ErrorType>

export enum ErrorCode {
  CLIENT_ERROR = 'CLIENT_ERROR',
  LOGIN_FAILED = 'LOGIN_FAILED',
  UNKNOWN_INTERNAL_ERROR = 'UNKNOWN_INTERNAL_ERROR',
}

export const ErrorCodeEnum = z.nativeEnum(ErrorCode)

export const errorSchema = z.object({
  id: z.string(),
  code: ErrorCodeEnum,
  message: z.string(),
  stackTrace: z.string().nullable(),
})

export type ErrorData = z.infer<typeof errorSchema>
