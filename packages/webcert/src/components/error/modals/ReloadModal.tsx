import ErrorModalBase from './ErrorModalBase'
import { ModalProps, reloadPage } from './ModalUtils'
import React from 'react'
import { useDispatch } from 'react-redux'

const ReloadModal: React.FC<ModalProps> = ({ errorData, children }) => {
  const dispatch = useDispatch()

  return (
    <ErrorModalBase
      errorData={errorData}
      confirmButtonText={'Ladda om intyget'}
      closeButtonText={'Stäng'}
      onConfirm={reloadPage(errorData, dispatch)}>
      {children}
    </ErrorModalBase>
  )
}

export default ReloadModal
