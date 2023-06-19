import { IDSAlert } from '@frontend/ids-react-ts'
import { useGetLinksQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { DynamicLink } from '../../DynamicLink/DynamicLink'
import { ErrorIdentifier } from '../ErrorIdentifier/ErrorIdentifier'

export function ErrorAlert({
  heading,
  errorType,
  text,
  dynamicLink,
  includeErrorId,
}: {
  heading: string
  errorType: 'info' | 'attention' | 'success' | 'error'
  text: string
  dynamicLink: boolean
  includeErrorId: boolean
}) {
  const { data: links } = useGetLinksQuery()
  const { errorId } = useAppSelector((state) => state.error)

  return (
    <IDSAlert type={errorType} headline={heading}>
      <div className="mb-5">
        <p slot="link-col-1">
          {text} {dynamicLink && <DynamicLink type="footer" link={links?.ineraNationellKundservice} />}
        </p>
      </div>
      {includeErrorId && <ErrorIdentifier id={errorId} />}
    </IDSAlert>
  )
}
