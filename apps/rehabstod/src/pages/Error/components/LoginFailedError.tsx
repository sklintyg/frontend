import { DynamicLink } from '../../../components/DynamicLink/DynamicLink'
import { Heading } from '../../../components/Heading/Heading'
import { ErrorCode } from '../../../schemas/errorSchema'
import { useGetLinksQuery } from '../../../store/api'
import { useLogErrorEffect } from '../hooks/useLogErrorEffect'

export function LoginFailedError() {
  const { data: links } = useGetLinksQuery()
  useLogErrorEffect({ message: 'login.failed', errorCode: ErrorCode.LOGIN_FAILED })

  return (
    <>
      <Heading level={1} size="l">
        Inloggning misslyckades
      </Heading>
      <p className="ids-preamble">
        Gå tillbaka till startsidan och försök igen. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand{' '}
        <DynamicLink link={links?.ineraNationellKundservice} />
      </p>
    </>
  )
}
