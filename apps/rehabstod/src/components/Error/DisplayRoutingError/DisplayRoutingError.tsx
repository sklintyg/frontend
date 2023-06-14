import {LoginFailedError} from '../ErrorRoutes/LoginFailedError'
import {HsaError} from '../ErrorRoutes/HsaError'
import {MissingEmployeeAssignmentError} from '../ErrorRoutes/MissingEmployeeAssignmentError'
import {HsaMissingRoleError} from '../ErrorRoutes/HsaMissingRoleError'
import {UnknownInternalError} from '../ErrorRoutes/UnknownInternalError'
import {ErrorCodeEnum} from '../../../schemas/errorSchema'

export function DisplayRoutingError({errorCode}: { errorCode: string | undefined }) {
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
