import React, { ReactNode, useEffect } from 'react'
import { CustomButton } from '@frontend/common'
import ModalBase from './ModalBase'
import { useKeyPress } from '../../../utils/userFunctionUtils'

interface Props {
  disabled: boolean
  name: string
  startIcon?: React.ReactNode
  modalTitle: string
  onConfirm: () => any
  confirmButtonText: string
  additionalConfirmButtonStyles?: string
  confirmButtonDisabled?: boolean
  declineButtonText?: string
  additionalButtonStyles?: string
  buttonStyle?: 'primary' | 'secondary' | 'success' | 'default'
  confirmButtonStyle?: 'primary' | 'secondary' | 'success' | 'default'
  description: string
  onClick?: () => void
  onClose?: () => void
  hideDeclineButton?: boolean
  onSaveModal?: (modal: ReactNode) => void
}

const ButtonWithConfirmModal: React.FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)
  const escPress = useKeyPress('Escape')

  const handleClickOpen = () => {
    setOpen(true)

    props.onClick?.()
  }

  const handleClose = () => {
    setOpen(false)

    props.onClose?.()
  }

  useEffect(() => {
    if (open) {
      props.onSaveModal?.(getModal())
    } else {
      props.onSaveModal?.(null)
    }
  }, [open])

  const handleConfirm = () => {
    setOpen(false)
    props.onConfirm()
  }

  const getModal = () => {
    return (
      <ModalBase
        open={open}
        handleClose={handleClose}
        title={props.modalTitle}
        content={props.children}
        buttons={
          <>
            <CustomButton
              buttonStyle={props.confirmButtonStyle ? props.confirmButtonStyle : 'primary'}
              className={props.additionalConfirmButtonStyles}
              disabled={props.confirmButtonDisabled}
              onClick={handleConfirm}
              text={props.confirmButtonText}
            />
            <CustomButton onClick={handleClose} buttonStyle="default" text={props.declineButtonText ? props.declineButtonText : 'Avbryt'} />
          </>
        }
      />
    )
  }

  useEffect(() => {
    if (escPress) {
      handleClose()
    }
  }, [escPress])

  return (
    <>
      <CustomButton
        tooltip={props.description}
        buttonStyle={props.buttonStyle ? props.buttonStyle : 'primary'}
        disabled={props.disabled}
        className={props.additionalButtonStyles}
        onClick={handleClickOpen}
        startIcon={props.startIcon ? props.startIcon : null}
        text={props.name}
      />
      {!props.onSaveModal && getModal()}
    </>
  )
}

export default ButtonWithConfirmModal
