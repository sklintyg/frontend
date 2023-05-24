import React, { ReactNode, useCallback, useEffect } from 'react'
import { useKeyPress } from '../../../utils/userFunctionUtils'
import { CustomButton } from '../../Inputs/CustomButton'
import ModalBase from './ModalBase'

interface Props {
  disabled: boolean
  name: string
  startIcon?: React.ReactNode
  modalTitle: string
  onConfirm: () => void
  confirmButtonText: string
  buttonTestId?: string
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
  hideConfirmButton?: boolean
  buttonClasses?: string
  children: ReactNode
}

const ButtonWithConfirmModal: React.FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)
  const escPress = useKeyPress('Escape')

  const handleClickOpen = () => {
    setOpen(true)

    props.onClick?.()
  }

  const handleConfirm = () => {
    setOpen(false)
    props.onConfirm()
  }

  const handleClose = useCallback(() => {
    setOpen(false)

    props.onClose?.()
  }, [setOpen, props])

  useEffect(() => {
    if (escPress) {
      handleClose()
    }
  }, [escPress, handleClose])

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
        data-testid={props.buttonTestId}
        buttonClasses={props.buttonClasses}
      />
      <ModalBase
        open={open}
        handleClose={handleClose}
        title={props.modalTitle}
        content={props.children}
        buttons={
          <>
            {props.hideDeclineButton !== true && (
              <CustomButton
                onClick={handleClose}
                buttonStyle="default"
                text={props.declineButtonText ? props.declineButtonText : 'Avbryt'}
              />
            )}
            {props.hideConfirmButton !== true && (
              <CustomButton
                buttonStyle={props.confirmButtonStyle ? props.confirmButtonStyle : 'primary'}
                className={props.additionalConfirmButtonStyles}
                disabled={props.confirmButtonDisabled}
                onClick={handleConfirm}
                text={props.confirmButtonText}
              />
            )}
          </>
        }
      />
    </>
  )
}

export default ButtonWithConfirmModal
