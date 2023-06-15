import { LoginFailedError } from '../../../components/error/ErrorRoutes/LoginFailedError'
import { HsaError } from '../../../components/error/ErrorRoutes/HsaError'
import { MissingEmployeeAssignmentError } from '../../../components/error/ErrorRoutes/MissingEmployeeAssignmentError'
import { HsaMissingRoleError } from '../../../components/error/ErrorRoutes/HsaMissingRoleError'
import { UnknownInternalError } from '../../../components/error/ErrorRoutes/UnknownInternalError'
import { ErrorCodeEnum } from '../../../schemas/errorSchema'

export function DisplayRoutingError({ errorCode }: { errorCode: string | undefined }) {
  switch (errorCode) {
    case ErrorCodeEnum.enum.LOGIN_FAILED:
      return <LoginFailedError />
    case ErrorCodeEnum.enum.LOGIN_HSA_ERROR:
      return <HsaError />
    case ErrorCodeEnum.enum.LOGIN_MEDARBETARUPPDRAG_SAKNAS:
      return <MissingEmployeeAssignmentError />
    case ErrorCodeEnum.enum.LOGIN_SAKNAR_HSA_REHABROLL:
      return <HsaMissingRoleError />
    default:
      return <UnknownInternalError />
  }
}
