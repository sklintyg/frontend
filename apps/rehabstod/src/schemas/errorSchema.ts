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

export enum ErrorTitle {
  LOGIN_FAILED = 'Inloggning misslyckades',
  LOGIN_HSA_ERROR = 'Tekniskt fel',
  LOGIN_MEDARBETARUPPDRAG_SAKNAS = 'Medarbetaruppdrag saknas',
  LOGIN_SAKNAR_HSA_REHABROLL = 'Behörighet saknas',
}

export enum ErrorText {
  LOGIN_FAILED = 'Gå tillbaka till startsidan och försök igen. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand ',
  LOGIN_HSA_ERROR = 'Försök igen om en stund. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand ',
  LOGIN_MEDARBETARUPPDRAG_SAKNAS = "Det krävs minst ett giltigt medarbetaruppdrag med ändamål 'Vård och behandling' för att använda Rehabstöd.",
  LOGIN_SAKNAR_HSA_REHABROLL = 'För att logga in som Rehabkoordinator krävs att du har den rollen för vårdenheten i HSA. Kontakta din lokala HSA-administratör för behörighet.',
}

export const ErrorCodeEnum = z.nativeEnum(ErrorCode)
export const ErrorTitleEnum = z.nativeEnum(ErrorTitle)
export const ErrorTextEnum = z.nativeEnum(ErrorText)

export const errorSchema = z.object({
  errorId: z.string(),
  errorCode: ErrorCodeEnum,
  message: z.string(),
  stackTrace: nullable(z.string()),
})

export type ErrorData = z.infer<typeof errorSchema>
