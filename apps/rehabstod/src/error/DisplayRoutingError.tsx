import { ErrorCode } from './ErrorCode'
import { ErrorLoginFailed } from './components/ErrorLoginFailed'
import { UnknownInternalError } from './components/UnknownInternalError'
import { ErrorMissingEmployeeAssignment } from './components/ErrorMissingEmployeeAssignment'
import { ErrorHsaError } from './components/ErrorHsaError'
import { ErrorHsaMissingRole } from './components/ErrorHsaMissingRole'

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
