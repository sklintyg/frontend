import { nullable, z } from 'zod'

export enum ErrorCode {
  CLIENT_ERROR = 'CLIENT_ERROR',
  SJF_CONSENT_SERVICE_ERROR = 'SJF_CONSENT_SERVICE_ERROR',
  SJF_BLOCKING_SERVICE_ERROR = 'SJF_BLOCKING_SERVICE_ERROR',
  REGISTER_SJF_CONSENT_ERROR = 'REGISTER_SJF_CONSENT_ERROR',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGIN_HSA_ERROR = 'LOGIN_HSA_ERROR',
  LOGIN_MEDARBETARUPPDRAG_SAKNAS = 'LOGIN_MEDARBETARUPPDRAG_SAKNAS',
  LOGIN_SAKNAR_HSA_REHABROLL = 'LOGIN_SAKNAR_HSA_REHABROLL',
  UNKNOWN_INTERNAL_ERROR = 'UNKNOWN_INTERNAL_ERROR',
}

export const ErrorCodeEnum = z.nativeEnum(ErrorCode)

const errorSchema = z.object({
  errorId: z.string(),
  errorCode: ErrorCodeEnum.or(z.string()),
  message: z.string(),
  stackTrace: nullable(z.string()),
})

export type ErrorData = z.infer<typeof errorSchema>
