import { Dispatch } from 'react'
import { clearError } from '../../../store/error/errorActions'
import { ErrorData } from '../../../store/error/errorReducer'

export interface ModalProps {
  errorData: ErrorData
}

export const reloadPage = (activeError: ErrorData, dispatch: Dispatch<any>) => {
  return (): void => {
    dispatch(clearError({ errorId: activeError.errorId }))
    window.location.reload()
  }
}

// https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
export const uuidv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const messageSubstring = (activeError: { message?: string }): string | undefined => {
  return activeError?.message?.substring(0, activeError.message?.indexOf(' -'))
}

export const NETWORK_ERROR = 'Network Error'
