import { DynamicLink } from '../../../components/DynamicLink/DynamicLink'
import { ErrorCode } from '../../../schemas/errorSchema'
import { useGetLinksQuery } from '../../../store/api'
import { useLogErrorEffect } from '../hooks/useLogErrorEffect'

export function LoginFailedError() {
  const { data: links } = useGetLinksQuery()
  useLogErrorEffect({ message: 'login.failed', errorCode: ErrorCode.LOGIN_FAILED })

  return (
    <>
      <h1 className="ids-heading-1">Inloggning misslyckades</h1>
      <p className="ids-preamble">
        Gå tillbaka till startsidan och försök igen. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand{' '}
        <DynamicLink type="footer" link={links?.ineraNationellKundservice} />
      </p>
    </>
  )
}
