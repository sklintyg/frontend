import { DynamicLink } from '../../../components/DynamicLink/DynamicLink'
import { ErrorCode } from '../../../schemas/errorSchema'
import { useGetLinksQuery } from '../../../store/api'
import { useLogErrorEffect } from '../hooks/useLogErrorEffect'

const UNKNOWN_INTERNAL_PROBLEM_TITLE = 'Tekniskt fel'
const UNKNOWN_INTERNAL_PROBLEM_MESSAGE =
  'Gå tillbaka till startsidan och prova att logga in igen. Om problemet kvarstår kontakta i första hand din lokala IT-support och i andra hand '

export function UnknownInternalError() {
  const { data: links } = useGetLinksQuery()
  useLogErrorEffect({ message: 'unknown', errorCode: ErrorCode.UNKNOWN_INTERNAL_ERROR })

  return (
    <>
      <h1 className="ids-heading-1">{UNKNOWN_INTERNAL_PROBLEM_TITLE} </h1>
      <p className="ids-preamble">
        {UNKNOWN_INTERNAL_PROBLEM_MESSAGE}
        <DynamicLink type="footer" link={links?.ineraNationellKundservice} />
      </p>
    </>
  )
}
