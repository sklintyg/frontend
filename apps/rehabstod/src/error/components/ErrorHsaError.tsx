import { ErrorText, ErrorTitle } from '../ErrorCode'
import { DynamicLink } from '../../components/DynamicLink/DynamicLink'
import { useGetLinksQuery } from '../../store/api'

export function ErrorHsaError() {
  const { data: links } = useGetLinksQuery()
  return (
    <>
      <h1 className="ids-heading-1">{ErrorTitle.LOGIN_HSA_ERROR} </h1>
      <p className="ids-preamble">
        {ErrorText.LOGIN_HSA_ERROR}
        <DynamicLink type="footer" link={links?.ineraNationellKundservice} />
      </p>
    </>
  )
}
