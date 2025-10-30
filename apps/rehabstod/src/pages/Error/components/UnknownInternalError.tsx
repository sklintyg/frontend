import { Heading } from '@frontend/components'
import { DynamicLink } from '../../../components/DynamicLink/DynamicLink'
import { ErrorCode } from '../../../schemas/errorSchema'
import { useGetLinksQuery } from '../../../store/api'
import { useLogErrorEffect } from '../hooks/useLogErrorEffect'

export function UnknownInternalError() {
  const { data: links } = useGetLinksQuery()
  useLogErrorEffect({ message: 'unknown', errorCode: ErrorCode.UNKNOWN_INTERNAL_ERROR })

  return (
    <>
      <Heading level={1} size="l">
        Tekniskt fel
      </Heading>
      <p className="ids-preamble">
        Gå tillbaka till startsidan och prova att logga in igen. Om problemet kvarstår kontakta i första hand din lokala IT-support och i
        andra hand <DynamicLink link={links?.ineraNationellKundservice} />
      </p>
    </>
  )
}
