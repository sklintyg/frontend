import { CustomButton } from '@frontend/common'
import React from 'react'
import { ConfirmModal } from './ConfirmModal'

interface Props {
  disabled: boolean
  name: string
  startIcon?: React.ReactNode
  modalTitle: string
  onConfirm: () => void
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
  buttonClasses?: string
}

const ButtonWithConfirmModal: React.FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)

    props.onClick?.()
  }

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
        buttonClasses={props.buttonClasses}
      />
      <ConfirmModal {...props} open={open} setOpen={setOpen} />
    </>
  )
}

export default ButtonWithConfirmModal
