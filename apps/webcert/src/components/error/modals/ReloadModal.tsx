import ErrorModalBase from './ErrorModalBase'
import type { ModalProps } from './errorUtils'
import { reloadPage } from './errorUtils'
import type React from 'react'
import { useDispatch } from 'react-redux'

export const RELOAD_CONFIRM_BUTTON_TEXT = 'Ladda om'
export const RELOAD_CLOSE_BUTTON_TEXT = 'Stäng'

const ReloadModal = ({ errorData, children }: ModalProps) => {
  const dispatch = useDispatch()

  return (
    <ErrorModalBase
      errorData={errorData}
      confirmButtonText={RELOAD_CONFIRM_BUTTON_TEXT}
      closeButtonText={RELOAD_CLOSE_BUTTON_TEXT}
      onConfirm={reloadPage(errorData, dispatch)}
    >
      {children}
    </ErrorModalBase>
  )
}

export default ReloadModal
