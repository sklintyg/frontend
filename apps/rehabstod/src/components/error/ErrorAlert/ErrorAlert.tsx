import { IDSAlert } from '@inera/ids-react'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useGetLinksQuery } from '../../../store/api'
import { DynamicLink } from '../../DynamicLink/DynamicLink'
import { ErrorIdentifier } from '../ErrorIdentifier'

export function ErrorAlert({
  heading,
  errorType,
  text,
  dynamicLink,
  error,
}: {
  heading: string
  errorType: 'info' | 'attention' | 'success' | 'error'
  text: string
  dynamicLink: boolean
  error?: (FetchBaseQueryError & { id?: string }) | (SerializedError & { id?: string })
}) {
  const { data: links } = useGetLinksQuery()

  return (
    <IDSAlert type={errorType} headline={heading}>
      <div className="mb-5">
        <p slot="link-col-1">
          {text} {dynamicLink && <DynamicLink type="footer" link={links?.ineraNationellKundservice} />}
        </p>
      </div>
      {error && error.id && <ErrorIdentifier id={error.id} />}
    </IDSAlert>
  )
}
