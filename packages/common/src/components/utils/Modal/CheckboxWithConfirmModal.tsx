import React from 'react'
import { Checkbox, CustomButton } from '@frontend/common'
import ModalBase from './ModalBase'

interface Props {
  disabled: boolean
  name: string
  modalTitle: string
  onConfirm: (isSelected: boolean) => void
  confirmButtonText: string
  additionalConfirmButtonStyles?: string
  confirmButtonDisabled?: boolean
  declineButtonText?: string
  additionalButtonStyles?: string
  buttonStyle?: 'primary' | 'secondary' | 'success' | 'default'
  confirmButtonStyle?: 'primary' | 'secondary' | 'success' | 'default'
  onClick?: () => void
  onClose?: () => void
  checked: boolean
}

const CheckboxWithConfirmModal: React.FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<boolean>(false)

  const handleClickOpen: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setSelected(event.currentTarget.checked)
    setOpen(true)

    props.onClick?.()
  }

  const handleClose = () => {
    setOpen(false)

    props.onClose?.()
  }

  const handleConfirm = () => {
    setOpen(false)
    props.onConfirm(selected)
  }

  return (
    <>
      <Checkbox
        id={'checkbox'}
        label={props.name}
        value="checked"
        checked={props.checked}
        vertical={true}
        disabled={props.disabled}
        onChange={handleClickOpen}
      />
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
    </>
  )
}

export default CheckboxWithConfirmModal
