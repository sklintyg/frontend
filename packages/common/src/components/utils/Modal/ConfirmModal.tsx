import { CustomButton, useKeyPress } from '@frontend/common'
import React, { useCallback, useEffect } from 'react'
import ModalBase from './ModalBase'

interface Props {
  additionalButtonStyles?: string
  additionalConfirmButtonStyles?: string
  confirmButtonDisabled?: boolean
  confirmButtonStyle?: 'primary' | 'secondary' | 'success' | 'default'
  confirmButtonText: string
  declineButtonText?: string
  disabled: boolean
  hideDeclineButton?: boolean
  hideConfirmButtom?: boolean
  modalTitle: string
  onClose?: () => void
  onConfirm: () => void
  setOpen: (val: boolean) => void
  startIcon?: React.ReactNode
  open: boolean
}

export const ConfirmModal: React.FC<Props> = ({
  additionalConfirmButtonStyles,
  children,
  confirmButtonDisabled,
  confirmButtonStyle,
  confirmButtonText,
  hideDeclineButton,
  hideConfirmButtom,
  modalTitle,
  declineButtonText,
  onClose,
  onConfirm,
  setOpen,
  open,
}) => {
  const escPress = useKeyPress('Escape')

  const handleClose = useCallback(() => {
    setOpen(false)

    onClose?.()
  }, [onClose, setOpen])

  const handleConfirm = () => {
    setOpen(false)
    onConfirm()
  }

  useEffect(() => {
    if (escPress) {
      handleClose()
    }
  }, [escPress, handleClose])

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      title={modalTitle}
      content={children}
      buttons={
        <>
          {hideDeclineButton != true && (
            <CustomButton onClick={handleClose} buttonStyle="default" text={declineButtonText ? declineButtonText : 'Avbryt'} />
          )}
          {hideConfirmButtom != true && (
            <CustomButton
              buttonStyle={confirmButtonStyle ? confirmButtonStyle : 'primary'}
              className={additionalConfirmButtonStyles}
              disabled={confirmButtonDisabled}
              onClick={handleConfirm}
              text={confirmButtonText}
            />
          )}
        </>
      }
    />
  )
}
