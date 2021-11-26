import { ErrorCode, ErrorData } from '../../../store/error/errorReducer'
import { Dispatch } from 'react'
import { clearError } from '../../../store/error/errorActions'

export interface ModalProps {
  errorData: ErrorData
}

export const reloadPage = (activeError: ErrorData, dispatch: Dispatch<any>) => {
  return () => {
    dispatch(clearError({ errorId: activeError.errorId }))
    window.location.reload()
  }
}
