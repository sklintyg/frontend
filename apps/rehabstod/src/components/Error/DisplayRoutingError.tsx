import { ErrorCode } from './ErrorCode'
import { ErrorLoginFailed } from './ErrorRoutes/ErrorLoginFailed'
import { ErrorHsaError } from './ErrorRoutes/ErrorHsaError'
import { ErrorMissingEmployeeAssignment } from './ErrorRoutes/ErrorMissingEmployeeAssignment'
import { ErrorHsaMissingRole } from './ErrorRoutes/ErrorHsaMissingRole'
import { UnknownInternalError } from './ErrorRoutes/UnknownInternalError'

export function DisplayRoutingError({ errorCode }: { errorCode: string | undefined }) {
  switch (errorCode) {
    case ErrorCode.LOGIN_FAILED:
      return <ErrorLoginFailed />
    case ErrorCode.LOGIN_HSA_ERROR:
      return <ErrorHsaError />
    case ErrorCode.LOGIN_MEDARBETARUPPDRAG_SAKNAS:
      return <ErrorMissingEmployeeAssignment />
    case ErrorCode.LOGIN_SAKNAR_HSA_REHABROLL:
      return <ErrorHsaMissingRole />
    default:
      return <UnknownInternalError />
  }
}
