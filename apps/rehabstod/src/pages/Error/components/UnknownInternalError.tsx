import { DynamicLink } from '../../../components/DynamicLink/DynamicLink'
import { ErrorCode } from '../../../schemas/errorSchema'
import { useGetLinksQuery } from '../../../store/api'
import { useLogErrorEffect } from '../hooks/useLogErrorEffect'

export function UnknownInternalError() {
  const { data: links } = useGetLinksQuery()
  useLogErrorEffect({ message: 'unknown', errorCode: ErrorCode.UNKNOWN_INTERNAL_ERROR })

  return (
    <>
      <h1 className="ids-heading-1">Tekniskt fel</h1>
      <p className="ids-preamble">
        Gå tillbaka till startsidan och prova att logga in igen. Om problemet kvarstår kontakta i första hand din lokala IT-support och i
        andra hand <DynamicLink type="footer" link={links?.ineraNationellKundservice} />
      </p>
    </>
  )
}
