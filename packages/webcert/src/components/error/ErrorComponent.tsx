import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveError } from '../../store/error/errorSelectors'
import { CONCURRENT_MODIFICATION, CONCURRENT_MODIFICATION_ERROR_MESSAGE, ErrorType } from '../../store/error/errorReducer'
import ErrorModal from './ErrorModal'
import { useHistory } from 'react-router-dom'
import { clearError } from '../../store/error/errorActions'

export interface ErrorRoute {
  errorCode: string
  errorId: string
}

const ErrorComponent: React.FC = () => {
  const activeError = useSelector(getActiveError)
  const history = useHistory()
  const dispatch = useDispatch()

  if (!activeError) return null

  const getModalOnClose = () => {
    switch (activeError.errorCode) {
      case CONCURRENT_MODIFICATION:
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
      case CONCURRENT_MODIFICATION:
        return (
          <ErrorModal
            errorData={activeError}
            confirmButtonText={'Ladda om intyget'}
            onConfirm={getModalOnClose()}
            content={CONCURRENT_MODIFICATION_ERROR_MESSAGE}
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
