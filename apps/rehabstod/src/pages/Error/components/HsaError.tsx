import { DynamicLink } from '../../../components/DynamicLink/DynamicLink'
import { ErrorCode } from '../../../schemas/errorSchema'
import { useGetLinksQuery } from '../../../store/api'
import { useLogErrorEffect } from '../hooks/useLogErrorEffect'

export function HsaError() {
  const { data: links } = useGetLinksQuery()
  useLogErrorEffect({ message: 'login.hsaerror', errorCode: ErrorCode.LOGIN_HSA_ERROR })

  return (
    <>
      <h1 className="ids-heading-1">Tekniskt fel</h1>
      <p className="ids-preamble">
        Försök igen om en stund. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand{' '}
        <DynamicLink type="footer" link={links?.ineraNationellKundservice} />
      </p>
    </>
  )
}
