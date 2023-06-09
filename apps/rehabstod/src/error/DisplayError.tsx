import { IDSAlert } from '@frontend/ids-react-ts'
import { useAppSelector } from '../store/hooks'
import { DynamicLink } from '../components/DynamicLink/DynamicLink'
import { useGetLinksQuery } from '../store/api'
import { ErrorId } from './ErrorId'

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
    <div className="mt-5">
      <IDSAlert type={errorType} headline={heading}>
        <p>
          <p slot="link-col-1">
            {text} {dynamicLink ? <DynamicLink type="footer" link={links?.ineraNationellKundservice} /> : ''}
          </p>
        </p>
        <ErrorId errorId={errorId} />
      </IDSAlert>
    </div>
  )
}
