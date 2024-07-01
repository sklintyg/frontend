import { clearError } from '../../../store/error/errorSlice'
import { ErrorData } from '../../../store/error/types'
import { AppDispatch } from '../../../store/store'

export interface ModalProps {
  errorData: ErrorData
}

export const reloadPage = (activeError: ErrorData, dispatch: AppDispatch) => {
  return (): void => {
    dispatch(clearError())
    window.location.reload()
  }
}

export const messageSubstring = (activeError: { message?: string }): string | undefined => {
  return activeError?.message?.substring(0, activeError.message?.indexOf(' -'))
}

export const NETWORK_ERROR = 'Network Error'
