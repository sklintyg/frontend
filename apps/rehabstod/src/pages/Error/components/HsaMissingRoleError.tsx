import { ErrorCode, ErrorTextEnum, ErrorTitleEnum } from '../../../schemas/errorSchema'
import { useLogErrorEffect } from '../hooks/useLogErrorEffect'

export function MissingHsaRoleError() {
  useLogErrorEffect({ message: 'login.saknar-hsa-rehabroll', errorCode: ErrorCode.LOGIN_SAKNAR_HSA_REHABROLL })

  return (
    <>
      <h1 className="ids-heading-1">{ErrorTitleEnum.enum.LOGIN_SAKNAR_HSA_REHABROLL} </h1>
      <p className="ids-preamble">{ErrorTextEnum.enum.LOGIN_SAKNAR_HSA_REHABROLL}</p>
    </>
  )
}
