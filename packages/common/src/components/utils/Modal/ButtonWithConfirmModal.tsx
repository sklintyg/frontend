import React, { ReactNode } from 'react'
import { ButtonTooltip, CustomButton } from '@frontend/common'
import ModalBase from './ModalBase'

interface Props {
  disabled: boolean
  name: string
  buttonColor?: 'inherit' | 'default' | 'primary' | 'secondary'
  startIcon?: React.ReactNode
  modalTitle: string
  onConfirm: () => any
  confirmButtonText: string
  confirmButtonColor?: 'inherit' | 'default' | 'primary' | 'secondary'
  additionalConfirmButtonStyles?: string
  confirmButtonDisabled?: boolean
  declineButtonText?: string
  additionalButtonStyles?: string
  buttonStyle?: 'primary' | 'secondary' | 'success'
  confirmButtonStyle?: 'primary' | 'secondary' | 'success'
  description: string
  onClick?: () => void
  onClose?: () => void
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
        color={props.buttonColor ? props.buttonColor : 'default'}
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
              style={props.buttonStyle ? props.buttonStyle : 'secondary'}
              className={props.additionalConfirmButtonStyles}
              //disableElevation
              disabled={props.confirmButtonDisabled}
              color={props.confirmButtonColor ? props.confirmButtonColor : 'default'}
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
