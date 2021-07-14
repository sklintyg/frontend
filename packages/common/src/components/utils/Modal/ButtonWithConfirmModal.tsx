import React, { ReactNode } from 'react'
import { ButtonTooltip, CustomButton } from '@frontend/common'
import ModalBase from './ModalBase'

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
}

const ButtonWithConfirmModal: React.FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)

    props.onClick?.()
  }

  const handleClose = () => {
    setOpen(false)

    props.onClose?.()
  }

  const handleConfirm = () => {
    setOpen(false)
    props.onConfirm()
  }

  return (
    <>
      <CustomButton
        tooltip={props.description}
        style={props.buttonStyle ? props.buttonStyle : 'primary'}
        disabled={props.disabled}
        className={props.additionalButtonStyles}
        onClick={handleClickOpen}
        startIcon={props.startIcon ? props.startIcon : null}
        text={props.name}
      />
      <ModalBase
        open={open}
        handleClose={handleClose}
        title={props.modalTitle}
        content={props.children}
        buttons={
          <>
            <CustomButton
              style={props.confirmButtonStyle ? props.confirmButtonStyle : 'primary'}
              className={props.additionalConfirmButtonStyles}
              disabled={props.confirmButtonDisabled}
              onClick={handleConfirm}
              text={props.confirmButtonText}
            />
            <CustomButton onClick={handleClose} style="default" text={props.declineButtonText ? props.declineButtonText : 'Avbryt'} />
          </>
        }
      />
    </>
  )
}

export default ButtonWithConfirmModal
