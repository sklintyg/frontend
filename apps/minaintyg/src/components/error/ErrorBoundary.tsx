import { randomUUID } from '@frontend/utils'
import { useEffect, useMemo } from 'react'
import { useRouteError } from 'react-router-dom'
import { ErrorCode } from '../../schema/error.schema'
import { useLogErrorMutation } from '../../store/api'
import { ErrorPageHero } from './ErrorPageHero'

export function ErrorBoundary() {
  const id = useMemo(randomUUID, [])
  const error = useRouteError()
  const [logError] = useLogErrorMutation()

  useEffect(() => {
    if (error instanceof Error) {
      logError({
        id,
        code: ErrorCode.enum.CLIENT_ERROR,
        message: error.message,
        stackTrace: error.stack ?? 'NO_STACK_TRACE',
      })
    }
  }, [error, id, logError])

  return <ErrorPageHero id={id} type="unknown" />
}
