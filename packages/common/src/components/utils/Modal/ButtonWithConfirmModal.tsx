import React, { useCallback, useEffect } from 'react'
import { CustomButton } from '@frontend/common'
import { useKeyPress } from '../../../utils/userFunctionUtils'
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
  const escPress = useKeyPress('Escape')

  const handleClickOpen = () => {
    setOpen(true)

    props.onClick?.()
  }

  const handleClose = useCallback(() => {
    setOpen(false)

    props.onClose?.()
  }, [setOpen, props])

  const handleConfirm = () => {
    setOpen(false)
    props.onConfirm()
  }

  useEffect(() => {
    if (escPress) {
      handleClose()
    }
  }, [escPress, handleClose])

  props.hasOwnProperty('something')

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
      <ModalBase
        open={open}
        handleClose={handleClose}
        title={props.modalTitle}
        content={props.children}
        buttons={
          <>
            <CustomButton onClick={handleClose} buttonStyle="default" text={props.declineButtonText ? props.declineButtonText : 'Avbryt'} />
            <CustomButton
              buttonStyle={props.confirmButtonStyle ? props.confirmButtonStyle : 'primary'}
              className={props.additionalConfirmButtonStyles}
              disabled={props.confirmButtonDisabled}
              onClick={handleConfirm}
              text={props.confirmButtonText}
            />
          </>
        }
      />
    </>
  )
}

export default ButtonWithConfirmModal
