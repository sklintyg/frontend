import { IDSContainer, IDSIconChevron, IDSLink } from '@frontend/ids-react-ts'
import { randomUUID } from '@frontend/utils'
import { useEffect, useRef } from 'react'
import { Link, useRouteError } from 'react-router-dom'
import { ErrorIdentifier } from '@frontend/components'
import { ErrorCode } from '../../../schemas/errorSchema'
import { useLogErrorMutation } from '../../../store/api'
import { PageHero } from '../../PageHero/PageHero'
import { ErrorBoundryStacktrace } from './ErrorBoundaryStacktrace'

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Unknown error'
}

function errorStacktrace(error: unknown): string | null {
  if (error instanceof Error) {
    return error.stack ?? null
  }
  return null
}

export function ErrorBoundary() {
  const error = useRouteError()
  const { current: errorId } = useRef(randomUUID())
  const message = errorMessage(error)
  const stackTrace = errorStacktrace(error)
  const [logError] = useLogErrorMutation()
  const request = useRef<ReturnType<typeof logError>>()

  useEffect(() => {
    if (request.current == null) {
      request.current = logError({
        errorData: {
          errorId,
          errorCode: ErrorCode.CLIENT_ERROR,
          message,
          stackTrace,
        },
      })
    }
  }, [errorId, logError, message, stackTrace])

  return (
    <IDSContainer>
      <PageHero type="error">
        <div className="mb-5">
          <h1 className="ids-heading-1">Ett fel har inträffat</h1>
          <p className="ids-preamble">{message}</p>
          {import.meta.env.MODE === 'development' && stackTrace !== null && <ErrorBoundryStacktrace stackTrace={stackTrace} />}
        </div>
        <ErrorIdentifier id={errorId} />
        <div className="mb-5 block h-px w-12 bg-neutral-40 md:hidden" />
        <div className="text-center">
          <IDSLink>
            <IDSIconChevron />
            <Link to="/">Till startsidan</Link>
          </IDSLink>
        </div>
      </PageHero>
    </IDSContainer>
  )
}
