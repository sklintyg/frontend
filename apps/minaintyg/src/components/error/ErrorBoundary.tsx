import { randomUUID } from '@frontend/utils'
import { useEffect, useMemo } from 'react'
import { useRouteError } from 'react-router-dom'
import { ErrorCode } from '../../schema/error.schema'
import { useLogErrorMutation } from '../../store/api'
import { useAppSelector } from '../../store/hooks'
import { ErrorPageHero } from './ErrorPageHero'

export function ErrorBoundary() {
  const hasSession = useAppSelector((state) => state.sessionSlice.hasSession)
  const id = useMemo(randomUUID, [])
  const error = useRouteError()
  const [logError] = useLogErrorMutation()

  useEffect(() => {
    if (error instanceof Error && hasSession) {
      logError({
        id,
        code: ErrorCode.enum.CLIENT_ERROR,
        message: error.message,
        stackTrace: error.stack ?? 'NO_STACK_TRACE',
      })
    }
  }, [error, id, logError, hasSession])

  return <ErrorPageHero id={id} type="unknown" />
}
