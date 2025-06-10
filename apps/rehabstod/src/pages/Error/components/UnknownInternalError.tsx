import { DynamicLink } from '../../../components/DynamicLink/DynamicLink'
import { Heading } from '../../../components/Heading/Heading'
import { ErrorCode } from '../../../schemas/errorSchema'
import { useGetLinksQuery } from '../../../store/api'
import { useLogErrorEffect } from '../hooks/useLogErrorEffect'

export function UnknownInternalError() {
  const { data: links } = useGetLinksQuery()
  useLogErrorEffect({ message: 'unknown', errorCode: ErrorCode.UNKNOWN_INTERNAL_ERROR })

  return (
    <>
      <Heading level={1} size="xxl">
        Tekniskt fel
      </Heading>
      <p className="ids-preamble">
        Gå tillbaka till startsidan och prova att logga in igen. Om problemet kvarstår kontakta i första hand din lokala IT-support och i
        andra hand <DynamicLink type="footer" link={links?.ineraNationellKundservice} />
      </p>
    </>
  )
}
