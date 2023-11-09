import { IDSAlert } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { ErrorObject } from '../../store/errorMiddleware'

export function TechnicalIssueAlert({
  children,
  headline = 'Tekniskt fel',
  error,
}: {
  children: ReactNode
  headline?: string
  error: ErrorObject
}) {
  return (
    <IDSAlert headline={headline} type="error">
      <div className="flex flex-col gap-4">
        {children}
        <p>
          <strong>Fel-ID:</strong> {error.id}
        </p>
      </div>
    </IDSAlert>
  )
}
