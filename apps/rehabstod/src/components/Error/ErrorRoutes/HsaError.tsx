import { DynamicLink } from '../../DynamicLink/DynamicLink'
import { useGetLinksQuery } from '../../../store/api'
import { ErrorTextEnum, ErrorTitleEnum } from '../../../schemas/errorSchema'

export function HsaError() {
  const { data: links } = useGetLinksQuery()
  return (
    <>
      <h1 className="ids-heading-1">{ErrorTitleEnum.enum.LOGIN_HSA_ERROR} </h1>
      <p className="ids-preamble">
        {ErrorTextEnum.enum.LOGIN_HSA_ERROR}
        <DynamicLink type="footer" link={links?.ineraNationellKundservice} />
      </p>
    </>
  )
}
