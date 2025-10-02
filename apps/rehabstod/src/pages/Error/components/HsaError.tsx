import { DynamicLink } from '../../../components/DynamicLink/DynamicLink'
import { Heading } from '../../../components/Heading/Heading'
import { ErrorCode } from '../../../schemas/errorSchema'
import { useGetLinksQuery } from '../../../store/api'
import { useLogErrorEffect } from '../hooks/useLogErrorEffect'

export function HsaError() {
  const { data: links } = useGetLinksQuery()
  useLogErrorEffect({ message: 'login.hsaerror', errorCode: ErrorCode.LOGIN_HSA_ERROR })

  return (
    <>
      <Heading level={1} size="l">
        Tekniskt fel
      </Heading>
      <p className="ids-preamble">
        Försök igen om en stund. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand{' '}
        <DynamicLink link={links?.ineraNationellKundservice} />
      </p>
    </>
  )
}
