import { ErrorCode, ErrorData } from '../../../store/error/errorReducer'
import { Dispatch } from 'react'
import { clearError } from '../../../store/error/errorActions'

export interface ModalProps {
  errorData: ErrorData
}

export const getModalOnClose = (errorCode: ErrorCode, errorData: ErrorData, dispatch: Dispatch<any>): (() => void) | undefined => {
  switch (errorCode) {
    case ErrorCode.CONCURRENT_MODIFICATION:
      return reloadPage(errorData, dispatch)
    default:
      return undefined
  }
}

export const reloadPage = (activeError: ErrorData, dispatch: Dispatch<any>) => {
  return () => {
    dispatch(clearError({ errorId: activeError.errorId }))
    window.location.reload()
  }
}
