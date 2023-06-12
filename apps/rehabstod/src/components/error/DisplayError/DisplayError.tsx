import { IDSAlert } from '@frontend/ids-react-ts'
import { useGetLinksQuery } from '../../../store/api'
import { useAppSelector } from '../../../store/hooks'
import { DynamicLink } from '../../DynamicLink/DynamicLink'
import { ErrorCode } from '../ErrorCode/ErrorCode'

export function DisplayError({
  heading,
  errorType,
  text,
  dynamicLink,
}: {
  heading: string
  errorType: 'info' | 'attention' | 'success' | 'error'
  text: string
  dynamicLink: boolean
}) {
  const { data: links } = useGetLinksQuery()
  const { errorId } = useAppSelector((state) => state.error)

  return (
    <IDSAlert type={errorType} headline={heading}>
      <div>
        <p slot="link-col-1">
          {text} {dynamicLink && <DynamicLink type="footer" link={links?.ineraNationellKundservice} />}
        </p>
      </div>
      <ErrorCode id={errorId} />
    </IDSAlert>
  )
}
