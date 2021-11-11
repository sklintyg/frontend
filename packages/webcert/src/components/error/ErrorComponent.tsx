import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveError } from '../../store/error/errorSelectors'
import { CONCURRENT_MODIFICATION, ErrorType } from '../../store/error/errorReducer'
import ErrorModal from './ErrorModal'
import { useHistory } from 'react-router-dom'

const ErrorComponent: React.FC = () => {
  const activeError = useSelector(getActiveError)
  const history = useHistory()

  if (!activeError) return null

  const getModalOnClose = () => {
    switch (activeError.errorCode) {
      case CONCURRENT_MODIFICATION:
        return window.location.reload

      default:
        return undefined
    }
  }

  const getModal = () => {
    switch (activeError.errorCode) {
      case CONCURRENT_MODIFICATION:
        return <ErrorModal confirmButtonText={'Ladda om intyget'} onClose={getModalOnClose()} />
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
          state: activeError.errorCode,
        })
        return null
      default:
        return null
    }
  }

  return getErrorComponent()
}

export default ErrorComponent
