import { ErrorIdentifier } from '@frontend/components'
import { IDSAlert } from '@inera/ids-react'
import type { ReactNode } from 'react'
import type { QueryError } from '../../utils/isQueryError'

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
    <IDSAlert headline={headline} role="alert" type="error">
      <div className="flex flex-col gap-4">
        {children}
        {error.id && <ErrorIdentifier id={error.id} centerText={false} />}
        {additionalInfo && additionalInfo}
      </div>
    </IDSAlert>
  )
}
