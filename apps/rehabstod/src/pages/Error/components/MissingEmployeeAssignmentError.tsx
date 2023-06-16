import { ErrorCode, ErrorTextEnum, ErrorTitleEnum } from '../../../schemas/errorSchema'
import { useLogErrorEffect } from '../hooks/useLogErrorEffect'

export function MissingEmployeeAssignmentError() {
  useLogErrorEffect({ message: 'login.medarbetaruppdrag', errorCode: ErrorCode.LOGIN_MEDARBETARUPPDRAG_SAKNAS })

  return (
    <>
      <h1 className="ids-heading-1">{ErrorTitleEnum.enum.LOGIN_MEDARBETARUPPDRAG_SAKNAS} </h1>
      <p className="ids-preamble">{ErrorTextEnum.enum.LOGIN_MEDARBETARUPPDRAG_SAKNAS}</p>
    </>
  )
}
