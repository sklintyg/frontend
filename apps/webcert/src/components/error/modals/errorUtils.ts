import type { Dispatch, ReactNode } from 'react'
import { clearError } from '../../../store/error/errorActions'
import type { ErrorData } from '../../../store/error/errorReducer'

export interface ModalProps {
  errorData: ErrorData
  children?: ReactNode
}

export const reloadPage = (activeError: ErrorData, dispatch: Dispatch<unknown>) => {
  return (): void => {
    dispatch(clearError({ errorId: activeError.errorId }))
    window.location.reload()
  }
}

export const messageSubstring = (activeError: { message?: string }): string | undefined => {
  return activeError?.message?.substring(0, activeError.message?.indexOf(' -'))
}

export const NETWORK_ERROR = 'Network Error'
