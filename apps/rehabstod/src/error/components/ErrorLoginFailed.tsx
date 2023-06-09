import { ErrorText, ErrorTitle } from '../ErrorCode'
import { DynamicLink } from '../../components/DynamicLink/DynamicLink'
import { useGetLinksQuery } from '../../store/api'

export function ErrorLoginFailed() {
  const { data: links } = useGetLinksQuery()

  return (
    <>
      <h1 className="ids-heading-1">{ErrorTitle.LOGIN_FAILED} </h1>
      <p className="ids-preamble">
        {ErrorText.LOGIN_FAILED} <DynamicLink type="footer" link={links?.ineraNationellKundservice} />
      </p>
    </>
  )
}
