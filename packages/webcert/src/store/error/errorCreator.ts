import { ErrorCode, ErrorRequest, ErrorType } from './errorReducer'
import { ApiError } from '../api/apiActions'
import { uuidv4 } from '../../components/error/modals/errorUtils'

export const createConcurrencyErrorRequestFromApiError = (apiError: ApiError, certificateId?: string): ErrorRequest => {
  const concurrencyError: ApiError = { ...apiError, errorCode: ErrorCode.CONCURRENT_MODIFICATION }
  return createErrorRequestFromApiError(concurrencyError, certificateId)
}

export const createSilentErrorRequestFromApiError = (apiError: ApiError, certificateId?: string): ErrorRequest => {
  return { ...createErrorRequestFromApiError(apiError, certificateId), type: ErrorType.SILENT }
}

export const createErrorRequestFromApiError = (apiError: ApiError, certificateId?: string): ErrorRequest => {
  const message = apiError.message + ' - ' + apiError.api
  if (
    apiError.errorCode === ErrorCode.TIMEOUT ||
    apiError.errorCode === ErrorCode.AUTHORIZATION_PROBLEM ||
    apiError.errorCode === ErrorCode.INVALID_LAUNCHID
  ) {
    return createErrorRequest(ErrorType.ROUTE, convert(apiError.errorCode), message, certificateId)
  } else {
    return createErrorRequest(ErrorType.MODAL, convert(apiError.errorCode), message, certificateId)
  }
}

export const createErrorRequestTimeout = (message: string): ErrorRequest => {
  return createErrorRequest(ErrorType.ROUTE, ErrorCode.TIMEOUT, message)
}

export const createErrorRequest = (
  type: ErrorType,
  errorCode: ErrorCode,
  message?: string,
  certificateId?: string,
  stackTrace?: string
): ErrorRequest => {
  return { certificateId, errorCode, message, stackTrace, type }
}

export const createErrorRequestWithErrorId = (
  type: ErrorType,
  errorCode: ErrorCode,
  message?: string,
  certificateId?: string,
  stackTrace?: string
): ErrorRequest => {
  return { certificateId, errorCode, message, stackTrace, type, errorId: uuidv4() }
}

function convert(errorCodeAsString: string): ErrorCode {
  const typedErrorCodeAsString = errorCodeAsString as keyof typeof ErrorCode
  if (!typedErrorCodeAsString) {
    return ErrorCode.UNKNOWN_INTERNAL_PROBLEM
  }
  return ErrorCode[typedErrorCodeAsString]
}
