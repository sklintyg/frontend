import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveError } from '../../store/error/errorSelectors'
import ErrorModal from './ErrorModal'
import { useHistory } from 'react-router-dom'
import { clearError } from '../../store/error/errorActions'
import { ErrorCode, ErrorType } from '../../store/error/errorReducer'

export interface ErrorRoute {
  errorCode: string
  errorId: string
}

export const CONCURRENT_MODIFICATION_ERROR_MESSAGE =
  'Utkastet har samtidigt ändrats av en annan användare och kunde därför inte sparas. Ladda om sidan och försök igen.'

const ErrorComponent: React.FC = () => {
  const activeError = useSelector(getActiveError)
  const history = useHistory()
  const dispatch = useDispatch()

  if (!activeError) return null

  const getModalOnClose = () => {
    switch (activeError.errorCode) {
      case ErrorCode.CONCURRENT_MODIFICATION:
        return () => {
          dispatch(clearError({ errorId: activeError.errorId }))
          window.location.reload()
        }
      default:
        return undefined
    }
  }

  const getModal = () => {
    switch (activeError.errorCode) {
      case ErrorCode.CONCURRENT_MODIFICATION:
        return (
          <ErrorModal
            errorData={activeError}
            confirmButtonText={'Ladda om intyget'}
            onConfirm={getModalOnClose()}
            content={CONCURRENT_MODIFICATION_ERROR_MESSAGE}
          />
        )
      case ErrorCode.UNKNOWN_INTERNAL_PROBLEM:
        return (
          <ErrorModal
            errorData={activeError}
            content={'Ett tekniskt problem inträffade. Försök igen och kontakta supporten om problemet kvarstår.'}
          />
        )
      default:
        return null
    }
  }

  const getErrorComponent = () => {
    switch (activeError.type) {
      case ErrorType.MODAL:
        return getModal()
      case ErrorType.ROUTE:
        history.push({
          pathname: '/error',
          state: { errorCode: activeError.errorCode, errorId: activeError.errorId },
        })
        return null
      default:
        return null
    }
  }

  return getErrorComponent()
}

export default ErrorComponent
