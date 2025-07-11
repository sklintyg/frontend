import type { ReactNode } from 'react'
import { useCallback, useEffect } from 'react'
import { useKeyPress } from '../../../utils/userFunctionUtils'
import { CustomButton } from '../../Inputs/CustomButton'
import ModalBase from './ModalBase'

interface Props {
  additionalButtonStyles?: string
  additionalConfirmButtonStyles?: string
  closeOnBackdropClick?: boolean
  confirmButtonDisabled?: boolean
  confirmButtonStyle?: 'primary' | 'secondary' | 'success' | 'default'
  confirmButtonText: string
  declineButtonText?: string
  disabled: boolean
  hideConfirmButton?: boolean
  hideDeclineButton?: boolean
  modalTitle: string
  onClose?: () => void
  onConfirm: () => void
  open: boolean
  setOpen: (val: boolean) => void
  startIcon?: ReactNode
  children: ReactNode
}

export const ConfirmModal = ({
  additionalConfirmButtonStyles,
  children,
  closeOnBackdropClick,
  confirmButtonDisabled,
  confirmButtonStyle,
  confirmButtonText,
  declineButtonText,
  hideConfirmButton,
  hideDeclineButton = false,
  modalTitle,
  onClose,
  onConfirm,
  open,
  setOpen,
}: Props) => {
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
          {hideDeclineButton !== true && (
            <CustomButton onClick={handleClose} buttonStyle="default" text={declineButtonText ? declineButtonText : 'Avbryt'} />
          )}
          {hideConfirmButton !== true && (
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
      closeOnBackdropClick={closeOnBackdropClick}
    />
  )
}
