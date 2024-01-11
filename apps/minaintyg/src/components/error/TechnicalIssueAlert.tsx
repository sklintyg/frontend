import { ErrorIdentifier } from '@frontend/components'
import { IDSAlert } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { QueryError } from '../../utils/isQueryError'

export function TechnicalIssueAlert({
  children,
  headline = 'Tekniskt fel',
  error,
  additionalInfo,
}: {
  children: ReactNode
  headline?: string
  error: QueryError
  additionalInfo?: ReactNode
}) {
  return (
    <IDSAlert headline={headline} type="error">
      <div className="flex flex-col gap-4">
        {children}
        {error.id && (
          <p>
            <ErrorIdentifier id={error.id} centerText={false} />
          </p>
        )}
        {additionalInfo && additionalInfo}
      </div>
    </IDSAlert>
  )
}
