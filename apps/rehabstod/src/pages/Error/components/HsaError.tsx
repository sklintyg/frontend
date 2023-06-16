import { DynamicLink } from '../../../components/DynamicLink/DynamicLink'
import { ErrorCode, ErrorTextEnum, ErrorTitleEnum } from '../../../schemas/errorSchema'
import { useGetLinksQuery } from '../../../store/api'
import { useLogErrorEffect } from '../hooks/useLogErrorEffect'

export function HsaError() {
  const { data: links } = useGetLinksQuery()
  useLogErrorEffect({ message: 'login.hsaerror', errorCode: ErrorCode.LOGIN_HSA_ERROR })

  return (
    <>
      <h1 className="ids-heading-1">{ErrorTitleEnum.enum.LOGIN_HSA_ERROR} </h1>
      <p className="ids-preamble">
        {ErrorTextEnum.enum.LOGIN_HSA_ERROR}
        <DynamicLink type="footer" link={links?.ineraNationellKundservice} />
      </p>
    </>
  )
}
