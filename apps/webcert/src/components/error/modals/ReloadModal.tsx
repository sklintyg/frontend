import ErrorModalBase from './ErrorModalBase'
import { ModalProps, reloadPage } from './errorUtils'
import React from 'react'
import { useDispatch } from 'react-redux'

export const RELOAD_CONFIRM_BUTTON_TEXT = 'Ladda om'
export const RELOAD_CLOSE_BUTTON_TEXT = 'Stäng'

const ReloadModal: React.FC<ModalProps> = ({ errorData, children }) => {
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
