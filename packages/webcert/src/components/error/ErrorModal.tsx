import React, { useState } from 'react'
import { CONCURRENT_MODIFICATION_ERROR_MESSAGE } from '../../store/error/errorReducer'
import { CustomButton, ModalBase } from '@frontend/common'

interface ErrorModalProps {
  onClose?: () => void
  confirmButtonText: string
  closeButtonText?: string
}

const ErrorModal: React.FC<ErrorModalProps> = ({ onClose, confirmButtonText, closeButtonText = 'Stäng' }) => {
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    onClose?.()
  }

  const getButtons = () => {
    return (
      <>
        <CustomButton onClick={handleClose} text={confirmButtonText} />
        <CustomButton onClick={() => setOpen(false)} text={closeButtonText} />
      </>
    )
  }

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      title={'En annan användare har redigerat utkastet'}
      buttons={getButtons()}
      content={CONCURRENT_MODIFICATION_ERROR_MESSAGE}
    />
  )
}

export default ErrorModal
