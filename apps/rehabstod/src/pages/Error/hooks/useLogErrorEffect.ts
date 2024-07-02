import { useContext, useEffect, useRef } from 'react'
import type { ErrorData } from '../../../schemas/errorSchema'
import { useLogErrorMutation } from '../../../store/api'
import { ErrorContext } from '../Error'

export function useLogErrorEffect({ message, errorCode }: Pick<ErrorData, 'message' | 'errorCode'>) {
  const errorId = useContext(ErrorContext)
  const [logError] = useLogErrorMutation()
  const request = useRef<ReturnType<typeof logError>>()

  if (errorId == null) {
    throw new Error('Error components must be wrapped in <Error />')
  }

  useEffect(() => {
    if (request.current == null) {
      request.current = logError({
        errorData: {
          errorId,
          stackTrace: null,
          message,
          errorCode,
        },
      })
    }
  }, [errorCode, errorId, logError, message])
}
