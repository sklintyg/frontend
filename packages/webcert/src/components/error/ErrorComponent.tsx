import React from 'react'
import { useSelector } from 'react-redux'
import { getActiveError } from '../../store/error/errorSelectors'
import { CONCURRENT_MODIFICATION, ErrorType } from '../../store/error/errorReducer'
import ErrorModal from './ErrorModal'

const ErrorComponent: React.FC = () => {
  const activeError = useSelector(getActiveError)

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

      default:
        return null
    }
  }

  return getErrorComponent()
}

export default ErrorComponent
