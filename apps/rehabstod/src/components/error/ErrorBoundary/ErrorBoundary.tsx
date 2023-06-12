import { IDSContainer, IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import { useEffect, useRef } from 'react'
import { Link, useRouteError } from 'react-router-dom'
import { api } from '../../../store/api'
import { useAppDispatch } from '../../../store/hooks'
import { uuidv4 } from '../../../utils/uuidv4'
import { PageHero } from '../../PageHero/PageHero'
import { ErrorCode } from '../ErrorCode/ErrorCode'
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
  const dispatch = useAppDispatch()
  const { current: errorId } = useRef(uuidv4())
  const message = errorMessage(error)
  const stackTrace = errorStacktrace(error)

  useEffect(() => {
    dispatch(
      api.endpoints.logError.initiate({
        errorData: {
          errorId,
          errorCode: 'No errorCode',
          message,
          stackTrace,
        },
      })
    )
  }, [dispatch, errorId, message, stackTrace])

  return (
    <IDSContainer>
      <PageHero type="error" icon="attention">
        <h1 className="ids-heading-1">Ett fel har inträffat</h1>
        <p className="ids-preamble">{message}</p>
        {import.meta.env.MODE === 'development' && stackTrace !== null && <ErrorBoundryStacktrace stackTrace={stackTrace} />}
        <ErrorCode id={errorId} />
        <div className="text-center">
          <IDSLink>
            <IDSIcon name="chevron" />
            <Link to="/">Till startsidan</Link>
          </IDSLink>
        </div>
      </PageHero>
    </IDSContainer>
  )
}
