import { randomUUID } from '@frontend/utils'
import { useEffect, useMemo, useRef } from 'react'
import { useRouteError } from 'react-router-dom'
import { ErrorPageHero } from './ErrorPageHero'
import { ErrorCode } from '../../schema/error.schema'
import { useLogErrorMutation } from '../../store/api'
import { useAppSelector } from '../../store/hooks'

export function ErrorBoundary() {
  const hasSession = useAppSelector((state) => state.sessionSlice.hasSession)
  const id = useMemo(randomUUID, [])
  const error = useRouteError()
  const [logError] = useLogErrorMutation()
  const isCalledRef = useRef(false)

  useEffect(() => {
    if (error instanceof Error && hasSession && !isCalledRef.current) {
      isCalledRef.current = true

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
