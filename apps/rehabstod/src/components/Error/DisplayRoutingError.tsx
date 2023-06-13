import { ErrorLoginFailed } from './ErrorRoutes/ErrorLoginFailed'
import { ErrorHsaError } from './ErrorRoutes/ErrorHsaError'
import { ErrorMissingEmployeeAssignment } from './ErrorRoutes/ErrorMissingEmployeeAssignment'
import { ErrorHsaMissingRole } from './ErrorRoutes/ErrorHsaMissingRole'
import { UnknownInternalError } from './ErrorRoutes/UnknownInternalError'
import { ErrorCodeEnum } from '../../schemas/errorSchema'

export function DisplayRoutingError({ errorCode }: { errorCode: string | undefined }) {
  switch (errorCode) {
    case ErrorCodeEnum.enum.LOGIN_FAILED:
      return <ErrorLoginFailed />
    case ErrorCodeEnum.enum.LOGIN_HSA_ERROR:
      return <ErrorHsaError />
    case ErrorCodeEnum.enum.LOGIN_MEDARBETARUPPDRAG_SAKNAS:
      return <ErrorMissingEmployeeAssignment />
    case ErrorCodeEnum.enum.LOGIN_SAKNAR_HSA_REHABROLL:
      return <ErrorHsaMissingRole />
    default:
      return <UnknownInternalError />
  }
}
